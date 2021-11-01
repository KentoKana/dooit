import { Box, Flex, Button } from "@chakra-ui/react";
import Cropper from "react-easy-crop";
import "./styles.css";
import { ModalTemplate } from "../ModalTemplate";
import { useState } from "react";
import { Area } from "react-easy-crop/types";
import { LoadingState } from "../../enums/LoadingState";

interface IMediaEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCropConfirmation: () => void;
  onCropAreaChange: (newCropArea: Area) => void;
  mediaUrl: string;
  cropperState: LoadingState;
}

export const MediaEditModal = ({
  isOpen,
  onCropConfirmation,
  onCropAreaChange,
  onClose,
  mediaUrl,
  cropperState,
}: IMediaEditModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
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
              onCropConfirmation();
            }}
            disabled={cropperState === LoadingState.Loading}
            isLoading={cropperState === LoadingState.Loading}
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
          image={mediaUrl}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={(_, croppedAreaPixels) => {
            onCropAreaChange(croppedAreaPixels);
          }}
          onZoomChange={setZoom}
        />
      </Box>
    </ModalTemplate>
  );
};
