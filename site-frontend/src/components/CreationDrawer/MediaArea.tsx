import {
  Flex,
  IconButton,
  Text,
  Image,
  Skeleton,
  useDisclosure,
  Link,
  Button,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import getCroppedImg from "./cropImage";
import { dataURLtoFile } from "./dataUrlToFile";
import Compressor from "compressorjs";
import { useDropzone } from "react-dropzone";

import "./styles.css";
import { Area } from "react-easy-crop/types";
import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import { IProject } from ".";
import { LoadingState } from "../../enums/LoadingState";
import { MediaEditModal } from "./MediaEditModal";

enum EDragState {
  None,
  DragEnter,
}

interface IMediaAreaProps {
  selectedItemIndex: number;
  formHook: UseFormReturn<IProject, object>;
}

export const MediaArea = ({ selectedItemIndex, formHook }: IMediaAreaProps) => {
  const { setValue, control } = formHook;
  const watchProjectItems = useWatch({
    name: `projectItems`,
    control,
  });
  const [showCropArea, setShowCropArea] = useState<boolean>(
    watchProjectItems &&
      watchProjectItems[selectedItemIndex] &&
      watchProjectItems[selectedItemIndex].mediaUrl
      ? false
      : true
  );
  const [mediaLoadingState, setMediaLoadingState] = useState<LoadingState>(
    LoadingState.None
  );
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const [dropzoneDragState, setDropzoneDragState] = useState<EDragState>(
    EDragState.None
  );

  const { onClose, onOpen, isOpen } = useDisclosure();

  const { getRootProps, getInputProps } = useDropzone({
    onDragEnter: () => {
      setDropzoneDragState(EDragState.DragEnter);
    },
    onDragLeave: () => {
      setDropzoneDragState(EDragState.None);
    },
    onDropAccepted: () => {
      setDropzoneDragState(EDragState.None);
    },
    onDrop: (files) => {
      onOpen();
      setMediaLoadingState(LoadingState.Loading);
      new Compressor(files[0]!, {
        ...defaultCompressorOptions,
        success: (compressedImage: File) => {
          setValue(
            `projectItems.${selectedItemIndex}.mediaAsFile`,
            compressedImage
          );
          setValue(
            `projectItems.${selectedItemIndex}.mediaUrl`,
            URL.createObjectURL(compressedImage)
          );
          setShowCropArea(true);
          setMediaLoadingState(LoadingState.Loaded);
        },
      });
    },
    multiple: false,
  });

  const onCropComplete = useCallback(
    async (croppedAreaPixels: Area) => {
      setMediaLoadingState(LoadingState.Loading);
      try {
        if (watchProjectItems && watchProjectItems[selectedItemIndex]) {
          const croppedImage = await getCroppedImg(
            watchProjectItems[selectedItemIndex].mediaUrl ?? "",
            croppedAreaPixels
          );
          const file = dataURLtoFile(croppedImage.toDataURL(), "");
          setValue(`projectItems.${selectedItemIndex}.mediaAsFile`, file);
        }
        setMediaLoadingState(LoadingState.Loaded);
      } catch (e) {
        console.error(e);
        setMediaLoadingState(LoadingState.Error);
      }
    },
    [setValue, selectedItemIndex, watchProjectItems]
  );

  return (
    <>
      {watchProjectItems &&
      watchProjectItems[selectedItemIndex] &&
      watchProjectItems[selectedItemIndex].mediaUrl ? (
        <>
          <Flex justifyContent="flex-end" width="100%" maxWidth="400px">
            <IconButton
              background="transparent"
              icon={<CloseIcon />}
              aria-label="Remove image"
              alignSelf="end"
              onClick={() => {
                setValue(
                  `projectItems.${selectedItemIndex}.mediaAsFile`,
                  undefined
                );
                setValue(
                  `projectItems.${selectedItemIndex}.mediaUrl`,
                  undefined
                );
              }}
            />
            {!showCropArea && (
              <IconButton
                background="transparent"
                icon={<EditIcon />}
                aria-label="Edit media"
                alignSelf="end"
                onClick={() => {
                  onOpen();
                  setShowCropArea(true);
                }}
              />
            )}
          </Flex>
          <Flex justifyContent="center">
            {mediaLoadingState !== LoadingState.Loading ? (
              <Link href="#" onClick={onOpen}>
                <Image
                  boxSize="400px"
                  src={URL.createObjectURL(
                    watchProjectItems[selectedItemIndex].mediaAsFile
                  )}
                />
              </Link>
            ) : (
              <Skeleton
                mt="4"
                noOfLines={4}
                spacing="4"
                height="400px"
                width="400px"
              />
            )}
          </Flex>
        </>
      ) : (
        <Button
          variant="unstyled"
          {...getRootProps()}
          display="flex"
          borderWidth="1px"
          borderColor="primary"
          borderStyle={
            dropzoneDragState === EDragState.DragEnter ? "solid" : "dashed"
          }
          w="100%"
          h="100%"
          maxWidth="400px"
          maxHeight="400px"
          borderRadius="sm"
          justifyContent="center"
          alignItems="center"
        >
          <input {...getInputProps()} />
          <Text>Drag 'n' drop some files here, or click to select files</Text>
        </Button>
      )}
      {watchProjectItems && watchProjectItems[selectedItemIndex] && (
        <MediaEditModal
          isOpen={isOpen}
          onCropConfirmation={() => {
            if (croppedAreaPixels) {
              onCropComplete(croppedAreaPixels);
              setCroppedAreaPixels(undefined);
              setShowCropArea(false);
            }
            onClose();
          }}
          onClose={onClose}
          onCropAreaChange={(area) => {
            setCroppedAreaPixels(area);
          }}
          mediaUrl={watchProjectItems[selectedItemIndex].mediaUrl!}
        />
      )}
    </>
  );
};

const defaultCompressorOptions = {
  quality: 0.6,
  convertSize: 2000000,
  maxHeight: 1920,
  maxWidth: 1920,
};
