import { Box } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { UseFormReturn, FieldValues } from "react-hook-form";
import getCroppedImg from "./cropImage";
import { dataURLtoFile } from "./dataUrlToFile";
import Compressor from "compressorjs";

import "./styles.css";
import { useDebounce } from "../../hooks/useDebounce";
import { Area } from "react-easy-crop/types";

interface IMediaAreaProps {
  selectedItemIndex: number;
  formHook: UseFormReturn<FieldValues, object>;
}

export const MediaArea = ({ selectedItemIndex, formHook }: IMediaAreaProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropCompleted, setCropCompleted] = useState<{
    croppedAreaPixels: Area;
    completed: boolean;
  }>();
  const debouncedCropCompleted = useDebounce<
    | {
        croppedAreaPixels: Area;
        completed: boolean;
      }
    | undefined
  >(cropCompleted, 1500);

  const { setValue } = formHook;

  const onCropComplete = useCallback(
    async (croppedAreaPixels: Area) => {
      try {
        const croppedImage = await getCroppedImg(
          "https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000",
          croppedAreaPixels
        );
        const file = dataURLtoFile(croppedImage.toDataURL(), "");
        new Compressor(file!, {
          quality: 0.7,
          convertSize: 2000000,
          maxHeight: 1920,
          maxWidth: 1920,
          success: (compressedImage: File) => {
            setValue(
              `projectItems.${selectedItemIndex}.mediaAsFile`,
              compressedImage
            );
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
    [setValue, selectedItemIndex]
  );

  useEffect(() => {
    if (debouncedCropCompleted?.completed) {
      onCropComplete(debouncedCropCompleted.croppedAreaPixels);
      setCropCompleted(undefined);
    }
  }, [cropCompleted, onCropComplete, debouncedCropCompleted]);

  return (
    <>
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
          image="https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
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
  );
};
