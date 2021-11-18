import { Box, Flex, Button, Image as ImageTag } from "@chakra-ui/react";
import "./styles.css";
import { ModalTemplate } from "../ModalTemplate";
import { useRef, useState } from "react";

interface IMediaTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  onCancel: () => void;
}

interface ITag {
  xCoord: number;
  yCoord: number;
  title: string;
}

export const MediaTagModal = ({
  isOpen,
  onClose,
  mediaUrl,
  onCancel,
}: IMediaTagModalProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const imageRef2 = useRef<HTMLImageElement>(null);
  const [tags, setTags] = useState<ITag>();
  const handleClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const scaleFactor =
      imageRef!.current!.offsetWidth! / imageRef2!.current!.offsetWidth;

    const rect = imageRef.current?.getBoundingClientRect();

    const x = (e.clientX - rect!.left - 10) * scaleFactor;
    const y = (e.clientY - rect!.top - 10) * scaleFactor;

    console.log(scaleFactor, e.clientY, rect!.top);

    setTags({
      xCoord: x,
      yCoord: y,
      title: "test",
    });
    // getHeightAndWidthFromDataUrl(mediaUrl).then((dimension) => {

    // });
  };

  //   const getHeightAndWidthFromDataUrl = (
  //     dataURL: string
  //   ): Promise<{ height: number; width: number }> =>
  //     new Promise((resolve) => {
  //       const img = new Image();
  //       img.onload = () => {
  //         resolve({
  //           height: img.height,
  //           width: img.width,
  //         });
  //       };
  //       img.src = dataURL;
  //     });

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
              onCancel();
            }}
            mr="3"
          >
            Cancel
          </Button>
          <Button
            width="100px"
            variant="primary"
            aria-label="Confirm to crop image"
            alignSelf="end"
            onClick={() => {
              onClose();
            }}
          >
            Done
          </Button>
        </Flex>
      }
    >
      <Box
        className="crop-container"
        css={{
          width: "50%",
          position: "relative",
          background: "#333",
        }}
      >
        <ImageTag
          position="absolute"
          ref={imageRef}
          src={mediaUrl}
          zIndex={1}
          //   onClick={(e) => {
          //     handleClick(e);
          //   }}
        />
        <Box
          zIndex={3}
          position="absolute"
          height="20px"
          width="20px"
          borderRadius="50%"
          top={tags?.yCoord ?? 0}
          left={tags?.xCoord ?? 0}
          background="white"
        ></Box>
      </Box>
      <ImageTag
        w="100%"
        position="relative"
        ref={imageRef2}
        src={mediaUrl}
        onClick={(e) => {
          handleClick(e);
        }}
      />
      {/* <Box
        position="absolute"
        height="20px"
        width="20px"
        borderRadius="50%"
        top={tags?.yCoord ?? 0}
        left={tags?.xCoord ?? 0}
        background="white"
      ></Box> */}
    </ModalTemplate>
  );
};
