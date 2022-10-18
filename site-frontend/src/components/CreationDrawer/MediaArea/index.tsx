import {
  Flex,
  Skeleton,
  useDisclosure,
  Button,
  Box,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import getCroppedImg from "../cropImage";
import { dataURLtoFile } from "../dataUrlToFile";
import Compressor from "compressorjs";
import { useDropzone } from "react-dropzone";

import "../styles.css";
import { Area } from "react-easy-crop/types";
import { IProject } from "../";
import { LoadingState } from "../../../enums/LoadingState";
import { MediaCropModal } from "./MediaCropModal";
import { ItemTextEditor } from "./ItemTextEditor";
import { AiFillPlusCircle } from "react-icons/ai";
import { EditButton } from "./EditButtonPopover";
import { MediaAreaImageContainer } from "./MediaAreaImageContainer";
enum EDragState {
  None,
  DragEnter,
  Rejected,
}

export interface IMediaAreaProps {
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

  const cropModalDisclosure = useDisclosure();
  const toast = useToast();

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    maxSize: 5000000,
    onDragEnter: () => {
      setDropzoneDragState(EDragState.DragEnter);
    },
    onDragLeave: () => {
      setDropzoneDragState(EDragState.None);
    },
    onDropAccepted: (files) => {
      cropModalDisclosure.onOpen();
      setDropzoneDragState(EDragState.None);
      setMediaLoadingState(LoadingState.Loading);
      setValue(`projectItems.${selectedItemIndex}.mediaAsFile`, files[0]);
      setValue(`projectItems.${selectedItemIndex}.tags`, []);
      setValue(
        `projectItems.${selectedItemIndex}.mediaUrl`,
        URL.createObjectURL(files[0])
      );

      setTimeout(() => {
        if (files[0].size > 1000000) {
          new Compressor(files[0], {
            ...defaultCompressorOptions,
            success: (compressedImage: File) => {
              setValue(
                `projectItems.${selectedItemIndex}.mediaAsFile`,
                files[0]
              );
              setValue(
                `projectItems.${selectedItemIndex}.mediaUrl`,
                URL.createObjectURL(compressedImage)
              );
              setMediaLoadingState(LoadingState.Loaded);
            },
          });
        } else {
          setMediaLoadingState(LoadingState.Loaded);
        }
      }, 400);
    },
    onDropRejected: (rejected) => {
      setDropzoneDragState(EDragState.Rejected);
      if (rejected[0].errors[0].code === "file-too-large") {
        toast({
          title: `Uh oh... :(`,
          description: "Your file is too large. The max size is 5MB",
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
        cropModalDisclosure.onClose();
      } catch (e) {
        setCropCompletionState(LoadingState.Error);
        cropModalDisclosure.onClose();
      }
    },
    [setValue, selectedItemIndex, watchProjectItems, cropModalDisclosure]
  );
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <Box
      position="relative"
      width="100%"
      m={["0px", "0px", "20px"]}
      maxWidth={["100%", "500px", "500px"]}
    >
      {watchProjectItems &&
      watchProjectItems[selectedItemIndex] &&
      watchProjectItems[selectedItemIndex].mediaUrl ? (
        <Box position="relative">
          <EditButton
            onRemoveImageClick={() => {
              setValue(
                `projectItems.${selectedItemIndex}.mediaAsFile`,
                undefined
              );
              setValue(`projectItems.${selectedItemIndex}.mediaUrl`, undefined);
              setValue(`projectItems.${selectedItemIndex}.tags`, []);
              setFilePreviouslyBlank(true);
            }}
          />
          <Flex justifyContent="center">
            {mediaLoadingState !== LoadingState.Loading &&
            cropCompletionState !== LoadingState.Loading ? (
              <Box w="100%" h="100%">
                <MediaAreaImageContainer
                  selectedItemIndex={selectedItemIndex}
                  formHook={formHook}
                  imageRef={imageRef}
                  mediaUrl={
                    watchProjectItems[selectedItemIndex].mediaAsFile
                      ? URL.createObjectURL(
                          watchProjectItems![selectedItemIndex]!
                            .mediaAsFile! as Blob
                        )
                      : ""
                  }
                />
              </Box>
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
        </Box>
      ) : (
        <Button
          id="mediabox"
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
                <Box color="grey.500" fontSize="sm">
                  <Text>Max File Size: 5MB</Text>
                  <Text>JPEG, PNG</Text>
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
      <Box my={[0, 0, 5]}>
        <ItemTextEditor
          formHook={formHook}
          selectedItemIndex={selectedItemIndex}
        />
      </Box>
      {watchProjectItems && watchProjectItems[selectedItemIndex] && (
        <MediaCropModal
          cropCompletionState={cropCompletionState}
          mediaLoadingState={mediaLoadingState}
          isOpen={cropModalDisclosure.isOpen}
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
              setValue(`projectItems.${selectedItemIndex}.tags`, []);
            }
            cropModalDisclosure.onClose();
          }}
          onClose={cropModalDisclosure.onClose}
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
