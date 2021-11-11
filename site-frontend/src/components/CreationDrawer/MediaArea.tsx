import {
  Flex,
  IconButton,
  Image,
  Skeleton,
  useDisclosure,
  Button,
  Box,
  useToast,
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
import { ItemTextEditor } from "./ItemTextEditor";
import { AiFillPlusCircle } from "react-icons/ai";
enum EDragState {
  None,
  DragEnter,
  Rejected,
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
  const [cropCompletionState, setCropCompletionState] = useState<LoadingState>(
    LoadingState.None
  );
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const [dropzoneDragState, setDropzoneDragState] = useState<EDragState>(
    EDragState.None
  );
  const [filePreviouslyBlank, setFilePreviouslyBlank] = useState(true);

  const { onClose, onOpen, isOpen } = useDisclosure();
  const toast = useToast();

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxSize: 2000000,
    onDragEnter: () => {
      setDropzoneDragState(EDragState.DragEnter);
    },
    onDragLeave: () => {
      setDropzoneDragState(EDragState.None);
    },
    onDropAccepted: (files) => {
      onOpen();
      setDropzoneDragState(EDragState.None);
      setMediaLoadingState(LoadingState.Loading);
      setValue(`projectItems.${selectedItemIndex}.mediaAsFile`, files[0]);
      setValue(
        `projectItems.${selectedItemIndex}.mediaUrl`,
        URL.createObjectURL(files[0])
      );
      setTimeout(() => {
        new Compressor(files[0], {
          ...defaultCompressorOptions,
          success: (compressedImage: File) => {
            setValue(`projectItems.${selectedItemIndex}.mediaAsFile`, files[0]);
            setValue(
              `projectItems.${selectedItemIndex}.mediaUrl`,
              URL.createObjectURL(compressedImage)
            );
            setMediaLoadingState(LoadingState.Loaded);
          },
        });
      }, 400);
    },
    onDropRejected: (rejected) => {
      setDropzoneDragState(EDragState.Rejected);
      if (rejected[0].errors[0].code === "file-too-large") {
        toast({
          title: `Uh oh... :(`,
          description: "Your file is too large. The max size is 2MB",
          status: "error",
          isClosable: true,
          position: "top",
        });
      }
    },

    multiple: false,
  });

  const onCropComplete = useCallback(
    async (croppedAreaPixels: Area) => {
      setCropCompletionState(LoadingState.Loading);
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
          setCropCompletionState(LoadingState.Loaded);
        }
        onClose();
      } catch (e) {
        console.error(e);
        setCropCompletionState(LoadingState.Error);
        onClose();
      }
    },
    [setValue, selectedItemIndex, watchProjectItems, onClose]
  );

  return (
    <Box position="relative" width="100%" mt="30px">
      {watchProjectItems &&
      watchProjectItems[selectedItemIndex] &&
      watchProjectItems[selectedItemIndex].mediaUrl ? (
        <>
          <Flex
            zIndex={1}
            justifyContent="flex-end"
            width="100%"
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
                setFilePreviouslyBlank(true);
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
            {mediaLoadingState !== LoadingState.Loading &&
            cropCompletionState !== LoadingState.Loading ? (
              <Button
                variant="unstyled"
                onClick={() => {
                  setFilePreviouslyBlank(false);
                  onOpen();
                }}
                w="100%"
                h="100%"
              >
                <Image
                  borderRadius="sm"
                  width="100%"
                  src={URL.createObjectURL(
                    watchProjectItems[selectedItemIndex].mediaAsFile
                  )}
                />
              </Button>
            ) : (
              <Skeleton
                mt="4"
                noOfLines={4}
                spacing="4"
                height="400px"
                width="100%"
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
          background={
            dropzoneDragState === EDragState.DragEnter ? "blue.600" : "cyan.100"
          }
          width="100%"
          height="300px"
          borderRadius="sm"
          justifyContent="center"
          alignItems="center"
        >
          <input {...getInputProps()} />
          <Box padding={3}>
            {dropzoneDragState !== EDragState.DragEnter ? (
              <Flex
                fontSize="xl"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
              >
                <Box fontSize="30px" mb={4} color="blue.600">
                  <AiFillPlusCircle />
                </Box>
                <Box>👊 Drop your media file here</Box>
                <Box color="blue.600" textDecoration="underline">
                  or click to select a file 🖱️
                </Box>
              </Flex>
            ) : (
              <Box fontSize="30px" color="#fff">
                You can let go now! 🖐{" "}
              </Box>
            )}
          </Box>
        </Button>
      )}
      <Box my={5}>
        <ItemTextEditor
          formHook={formHook}
          selectedItemIndex={selectedItemIndex}
        />
      </Box>
      {watchProjectItems && watchProjectItems[selectedItemIndex] && (
        <MediaEditModal
          cropCompletionState={cropCompletionState}
          mediaLoadingState={mediaLoadingState}
          isOpen={isOpen}
          onCropConfirmation={() => {
            if (croppedAreaPixels) {
              onCropComplete(croppedAreaPixels);
              setCroppedAreaPixels(undefined);
            }
          }}
          onCropCancel={() => {
            if (filePreviouslyBlank) {
              setValue(
                `projectItems.${selectedItemIndex}.mediaAsFile`,
                undefined
              );
              setValue(`projectItems.${selectedItemIndex}.mediaUrl`, undefined);
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
    </Box>
  );
};

const defaultCompressorOptions = {
  quality: 0.8,
  convertSize: 2000000,
  maxHeight: 1920,
  maxWidth: 1920,
};
