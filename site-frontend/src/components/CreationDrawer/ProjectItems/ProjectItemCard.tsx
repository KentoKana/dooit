import { Box, Flex, Image, Text } from "@chakra-ui/react";

import { DragHandleIcon } from "@chakra-ui/icons";
import { ProjectItemTopBar } from "./ProjectItemTopBar";
import { truncateText } from "../../../utils";
import { IProjectItem } from ".";

interface IProjectItemCardProps {
  projectItemsState: IProjectItem[];
  selectedItemIndex: number;
  currentItemIndex: number;
  onProjectItemAction: {
    onMoveItemLeft: () => void;
    onMoveItemRight: () => void;
    onRemoveItem: () => void;
    onAddItem: () => void;
    onItemSelect: () => void;
  };
}

export const ProjectItemCard = ({
  projectItemsState,
  selectedItemIndex,
  currentItemIndex,
  onProjectItemAction,
}: IProjectItemCardProps) => {
  let mediaPreviewUrl: string | undefined = undefined;

  if (
    projectItemsState &&
    projectItemsState[currentItemIndex] &&
    projectItemsState[currentItemIndex].mediaUrl
  ) {
    mediaPreviewUrl = URL.createObjectURL(
      projectItemsState[currentItemIndex].mediaAsFile as Blob
    );
  }
  return (
    <>
      <ProjectItemTopBar
        disableMoveLeft={currentItemIndex === 0}
        disableMoveRight={currentItemIndex === projectItemsState.length - 1}
        onMoveItemLeft={() => {
          onProjectItemAction.onMoveItemLeft();
        }}
        onMoveItemRight={() => {
          onProjectItemAction.onMoveItemRight();
        }}
        itemLength={projectItemsState.length}
        onRemove={() => {
          onProjectItemAction.onRemoveItem();
        }}
        onAdd={() => {
          onProjectItemAction.onAddItem();
        }}
      />
      <Flex
        color="grey.700"
        width={"120px"}
        height={"120px"}
        transition="0.2s ease all"
        borderRadius="sm"
        backgroundColor={
          selectedItemIndex === currentItemIndex ? "cyan.100" : "grey.50"
        }
        _hover={{
          backgroundColor: "cyan.100",
        }}
      >
        <Box w="10%">
          <Flex
            w="10%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            px={3}
            borderLeft="4px solid"
            borderColor={
              selectedItemIndex === currentItemIndex ? "primary" : "grey.100"
            }
            direction="column"
          >
            <DragHandleIcon title="Drag item" />
          </Flex>
        </Box>
        <Box width="90%">
          <Box
            _focus={{
              outline: "none",
            }}
            background="transparent"
            height="100%"
            width="100%"
            variant="unstyled"
            onClick={() => {
              onProjectItemAction.onItemSelect();
            }}
          >
            {mediaPreviewUrl ||
            (projectItemsState[currentItemIndex] &&
              projectItemsState[currentItemIndex].description) ? (
              <Flex
                py="10px"
                justifyContent="center"
                alignItems="center"
                height="100%"
                width="100%"
                overflowY="auto"
                direction="column"
              >
                <Box>
                  {mediaPreviewUrl && (
                    <Image
                      borderRadius="sm"
                      boxSize="85px"
                      _hover={{
                        boxSize: "85px",
                      }}
                      transition="0.2s ease all"
                      objectFit="cover"
                      src={mediaPreviewUrl}
                      alt=""
                    />
                  )}
                  {projectItemsState[currentItemIndex] &&
                    projectItemsState[currentItemIndex].description &&
                    !mediaPreviewUrl && (
                      <Text
                        fontSize="sm"
                        maxWidth={"85px"}
                        textAlign="left"
                        fontWeight="normal"
                        whiteSpace="break-spaces"
                        overflowX="hidden"
                        overflowY="auto"
                      >
                        {projectItemsState[currentItemIndex] &&
                        projectItemsState[currentItemIndex].description
                          ? truncateText(
                              projectItemsState[currentItemIndex].description,
                              60
                            )
                          : ""}
                      </Text>
                    )}
                </Box>
              </Flex>
            ) : (
              <Flex justifyContent="center" alignItems="center" height="100%">
                Empty
              </Flex>
            )}
          </Box>
        </Box>
      </Flex>
    </>
  );
};
