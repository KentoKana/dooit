import { Box } from "@chakra-ui/react";
import { useCallback, useState } from "react";

import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import { dataURLtoFile } from "./dataUrlToFile";
import "./styles.css";

interface IMediaAreaProps {
  onCropCompletion: (file: File) => void;
}

export const MediaArea = ({ onCropCompletion }: IMediaAreaProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback(
    async (croppedAreaPixels) => {
      try {
        const croppedImage = await getCroppedImg(
          "https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000",
          croppedAreaPixels
        );
        // console.log("donee", { croppedImage });
        const file = dataURLtoFile(croppedImage.toDataURL(), "tempfile");
        onCropCompletion(file);
      } catch (e) {
        console.error(e);
      }
    },
    [onCropCompletion]
  );

  return (
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
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
    </Box>
  );
};
