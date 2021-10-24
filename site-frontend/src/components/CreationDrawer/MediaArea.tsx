import { Box, Flex, IconButton, Text, Image, Skeleton } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { UseFormReturn, useWatch } from "react-hook-form";
import getCroppedImg from "./cropImage";
import { dataURLtoFile } from "./dataUrlToFile";
import Compressor from "compressorjs";
import { useDropzone } from "react-dropzone";

import "./styles.css";
import { Area } from "react-easy-crop/types";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import { IProject } from ".";
import { LoadingState } from "../../enums/LoadingState";

interface IMediaAreaProps {
  selectedItemIndex: number;
  formHook: UseFormReturn<IProject, object>;
}

export const MediaArea = ({ selectedItemIndex, formHook }: IMediaAreaProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropArea, setShowCropArea] = useState<boolean>(true);
  const [mediaLoadingState, setMediaLoadingState] = useState<LoadingState>(
    LoadingState.None
  );

  const [cropCompleted, setCropCompleted] = useState<{
    croppedAreaPixels: Area;
    completed: boolean;
  }>();

  const { setValue, control } = formHook;
  const watchProjectItems = useWatch({
    name: `projectItems`,
    control,
  });
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
            {showCropArea && (
              <IconButton
                background="transparent"
                icon={<CheckIcon />}
                aria-label="Confirm to crop image"
                alignSelf="end"
                onClick={() => {
                  if (cropCompleted) {
                    onCropComplete(cropCompleted.croppedAreaPixels);
                    setCropCompleted(undefined);
                    setShowCropArea(false);
                  }
                }}
              />
            )}
            {!showCropArea && (
              <IconButton
                background="transparent"
                icon={<EditIcon />}
                aria-label="Edit media"
                alignSelf="end"
                onClick={() => {
                  setShowCropArea(true);
                }}
              />
            )}
          </Flex>
          {showCropArea ? (
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
                  setCropCompleted({
                    croppedAreaPixels,
                    completed: true,
                  });
                }}
                onZoomChange={setZoom}
              />
            </Box>
          ) : (
            <Flex justifyContent="center">
              {mediaLoadingState === LoadingState.Loaded ? (
                <Image
                  boxSize="400px"
                  src={URL.createObjectURL(
                    watchProjectItems[selectedItemIndex].mediaAsFile
                  )}
                />
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
          )}
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
              setShowCropArea(true);
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
                },
              });
            }}
          />
          <Text>Drag 'n' drop some files here, or click to select files</Text>
        </Flex>
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
