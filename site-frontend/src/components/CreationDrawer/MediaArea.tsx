import {
  Box,
  Flex,
  IconButton,
  Text,
  Image,
  Skeleton,
  useDisclosure,
  Link,
  Button,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
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
import { ModalTemplate } from "../ModalTemplate";

interface IMediaAreaProps {
  selectedItemIndex: number;
  formHook: UseFormReturn<IProject, object>;
}

export const MediaArea = ({ selectedItemIndex, formHook }: IMediaAreaProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
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

  const { onClose, onOpen, isOpen } = useDisclosure();

  const { getRootProps, getInputProps } = useDropzone({
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
          <Flex justifyContent="flex-end">
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
        <Flex
          {...getRootProps()}
          border="1px dashed"
          borderColor="primary"
          w="100%"
          h="100%"
          borderRadius="sm"
          justifyContent="center"
          alignItems="center"
        >
          <input
            {...getInputProps()}
            onChange={(e) => {
              onOpen();
              setMediaLoadingState(LoadingState.Loading);
              new Compressor(e!.target!.files![0]!, {
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
            }}
          />
          <Text>Drag 'n' drop some files here, or click to select files</Text>
        </Flex>
      )}
      {watchProjectItems && watchProjectItems[selectedItemIndex] && (
        <ModalTemplate
          isOpen={isOpen}
          onClose={onClose}
          footer={
            <Flex justifyContent="space-between" w="100%">
              <Button
                width="100%"
                variant="primary"
                aria-label="Confirm to crop image"
                alignSelf="end"
                onClick={() => {
                  if (croppedAreaPixels) {
                    onCropComplete(croppedAreaPixels);
                    setCroppedAreaPixels(undefined);
                    setShowCropArea(false);
                  }
                  onClose();
                }}
              >
                Crop
              </Button>
            </Flex>
          }
        >
          <Box
            className="crop-container"
            css={{
              width: "100%",
              height: "400px",
              position: "relative",
              background: "#333",
            }}
          >
            <Cropper
              image={watchProjectItems[selectedItemIndex].mediaUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={(_, croppedAreaPixels) => {
                setCroppedAreaPixels(croppedAreaPixels);
              }}
              onZoomChange={setZoom}
            />
          </Box>
        </ModalTemplate>
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
