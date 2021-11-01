import {
  Flex,
  IconButton,
  Text,
  Image,
  Skeleton,
  useDisclosure,
  Link,
  Button,
  Box,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import getCroppedImg from "./cropImage";
import { dataURLtoFile } from "./dataUrlToFile";
import Compressor from "compressorjs";
import { useDropzone } from "react-dropzone";

import "./styles.css";
import { Area } from "react-easy-crop/types";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
      setMediaLoadingState(LoadingState.Loading);

      onOpen();
      new Compressor(files[0], {
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
          setMediaLoadingState(LoadingState.Loaded);
        },
      });
    },
    multiple: false,
  });

  const onCropComplete = useCallback(
    async (croppedAreaPixels: Area) => {
      try {
        if (watchProjectItems && watchProjectItems[selectedItemIndex]) {
          const croppedImage = await getCroppedImg(
            watchProjectItems[selectedItemIndex].mediaUrl ?? "",
            croppedAreaPixels
          );
          const file = dataURLtoFile(
            croppedImage.toDataURL("image/jpeg"),
            selectedItemIndex.toString()
          );
          setValue(`projectItems.${selectedItemIndex}.mediaAsFile`, file);
          setMediaLoadingState(LoadingState.Loaded);
        }
      } catch (e) {
        console.error(e);
        setMediaLoadingState(LoadingState.Error);
      }
    },
    [setValue, selectedItemIndex, watchProjectItems]
  );

  return (
    <Box position="relative">
      {watchProjectItems &&
      watchProjectItems[selectedItemIndex] &&
      watchProjectItems[selectedItemIndex].mediaUrl ? (
        <>
          <Flex
            justifyContent="flex-end"
            width="100%"
            maxWidth="400px"
            position="absolute"
            opacity={0.3}
            transition="0.2s ease all"
            _hover={{ opacity: 0.8 }}
            background="black"
          >
            <IconButton
              _hover={{ color: "blue.200" }}
              color="#fff"
              background="transparent"
              icon={<DeleteIcon />}
              title="Remove media"
              aria-label="Remove media"
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
            <IconButton
              color="#fff"
              title="Edit media"
              _hover={{ color: "blue.200" }}
              background="transparent"
              icon={<EditIcon />}
              aria-label="Edit media"
              alignSelf="end"
              onClick={() => {
                onOpen();
              }}
            />
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
          p={3}
          autoFocus
          variant="unstyled"
          {...getRootProps()}
          display="flex"
          borderWidth="2px"
          borderColor="primary"
          borderStyle={
            dropzoneDragState === EDragState.DragEnter ? "solid" : "dashed"
          }
          w="100%"
          h="100%"
          width="400px"
          height="400px"
          maxWidth="400px"
          maxHeight="400px"
          borderRadius="sm"
          justifyContent="center"
          alignItems="center"
        >
          <input {...getInputProps()} />
          <Text padding={3}>
            Drop your media file here, or click to select a file
          </Text>
        </Button>
      )}
      {watchProjectItems && watchProjectItems[selectedItemIndex] && (
        <MediaEditModal
          cropperState={mediaLoadingState}
          isOpen={isOpen}
          onCropConfirmation={() => {
            onClose();
            setMediaLoadingState(LoadingState.Loading);
            if (croppedAreaPixels) {
              onCropComplete(croppedAreaPixels);
              setCroppedAreaPixels(undefined);
            }
          }}
          onClose={onClose}
          onCropAreaChange={(area) => {
            setCroppedAreaPixels(area);
          }}
          mediaUrl={watchProjectItems[selectedItemIndex].mediaUrl!}
        />
      )}
    </Box>
  );
};

const defaultCompressorOptions = {
  quality: 0.8,
  convertSize: 2000000,
  maxHeight: 1920,
  maxWidth: 1920,
};
