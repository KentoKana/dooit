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
  mediaLoadingState: LoadingState;
  cropCompletionState: LoadingState;
  onCropCancel: () => void;
}

export const MediaEditModal = ({
  isOpen,
  onCropConfirmation,
  onCropAreaChange,
  onClose,
  mediaUrl,
  mediaLoadingState,
  cropCompletionState,
  onCropCancel,
}: IMediaEditModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <Flex justifyContent="flex-end" w="100%" flexWrap="wrap">
          <Button
            borderRadius="sm"
            width="100px"
            onClick={() => {
              onCropCancel();
            }}
            mr="3"
            disabled={
              mediaLoadingState === LoadingState.Loading ||
              cropCompletionState === LoadingState.Loading
            }
          >
            Cancel
          </Button>
          <Button
            width="100px"
            variant="primary"
            aria-label="Confirm to crop image"
            alignSelf="end"
            onClick={() => {
              onCropConfirmation();
            }}
            disabled={
              mediaLoadingState === LoadingState.Loading ||
              cropCompletionState === LoadingState.Loading
            }
            isLoading={
              mediaLoadingState === LoadingState.Loading ||
              cropCompletionState === LoadingState.Loading
            }
          >
            Crop
          </Button>
        </Flex>
      }
    >
      <Box
        style={
          mediaLoadingState === LoadingState.Loading
            ? { filter: "blur(2px)" }
            : undefined
        }
        className="crop-container"
        css={{
          width: "100%",
          height: "400px",
          position: "relative",
          background: "#333",
        }}
      >
        <Cropper
          objectFit="horizontal-cover"
          image={mediaUrl}
          crop={crop}
          zoomSpeed={1.4}
          zoom={zoom}
          aspect={4 / 3}
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
