import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { UseFormReturn, useWatch } from "react-hook-form";
import getCroppedImg from "./cropImage";
import { dataURLtoFile } from "./dataUrlToFile";
import Compressor from "compressorjs";
import { useDropzone } from "react-dropzone";

import "./styles.css";
import { Area } from "react-easy-crop/types";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { IProject } from ".";

interface IMediaAreaProps {
  selectedItemIndex: number;
  formHook: UseFormReturn<IProject, object>;
}

export const MediaArea = ({ selectedItemIndex, formHook }: IMediaAreaProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

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
      try {
        if (watchProjectItems && watchProjectItems[selectedItemIndex]) {
          const croppedImage = await getCroppedImg(
            watchProjectItems[selectedItemIndex].mediaUrl ?? "",
            croppedAreaPixels
          );
          const file = dataURLtoFile(croppedImage.toDataURL(), "");
          setValue(`projectItems.${selectedItemIndex}.mediaAsFile`, file);
        }
      } catch (e) {
        console.error(e);
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
          <IconButton
            icon={<CloseIcon />}
            aria-label="Remove image"
            alignSelf="end"
            onClick={() => {
              setValue(
                `projectItems.${selectedItemIndex}.mediaAsFile`,
                undefined
              );
              setValue(`projectItems.${selectedItemIndex}.mediaUrl`, undefined);
            }}
          />
          <IconButton
            icon={<CheckIcon />}
            aria-label="Confirm to crop image"
            alignSelf="end"
            onClick={() => {
              if (cropCompleted) {
                onCropComplete(cropCompleted.croppedAreaPixels);
                setCropCompleted(undefined);
              }
            }}
          />
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
