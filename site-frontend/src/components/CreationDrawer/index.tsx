import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Spinner,
  Text,
  useDisclosure,
  useMediaQuery,
  useToast
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { ProjectCreationService } from "../../classes/ProjectCreationService";
import { HttpError } from "../../Dtos/HttpError.dto";
import { ProjectCreateDto } from "../../Dtos/project/ProjectCreateDto.dto";
import { ProjectGetDto } from "../../Dtos/project/ProjectGetDto.dto";
import { BreakPoints } from "../../enums/BreakPoints";
import { LoadingState } from "../../enums/LoadingState";
import { useGetProjectCreationOptions } from "../../hooks/data/useGetProjectCreationOptions";
import { UseStores } from "../../stores/StoreContexts";
import { DrawerTemplate } from "../DrawerTemplate";
import { ActionConfirmationModal } from "./ActionConfirmationModal";
import { DrawerLayout } from "./DrawerLayout";
import { IProjectItem } from "./ProjectItems";
import { Sidebar } from "./Sidebar";
export interface IIngredient {
  ingredient: string;
  quantity: number;
  unit: string;
}

export interface IProject {
  name: string;
  projectDescription: string;
  flair?: string;
  projectItems: IProjectItem[];
  ingredients: IIngredient[];
}

interface ICreationDrawerProps {
  onProjectCreation: (loadingState: LoadingState) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const CreationDrawer = observer(
  ({ isOpen, onClose, onProjectCreation }: ICreationDrawerProps) => {
    const { userStore, uiStore } = UseStores();
    const toast = useToast();
    const [showMobileLayout] = useMediaQuery(BreakPoints.Mobile);

    const defaultValues: IProject = useMemo(() => {
      return {
        name: "",
        projectDescription: "",
        ingredients: [],
        projectItems: [
          {
            title: "",
            description: "",
            order: 0,
            tags: [],
            originalImageWidth: 0,
          },
        ],
      };
    }, []);
    const formHook = useForm<IProject>({
      defaultValues: defaultValues,
    });
    const { handleSubmit, reset } = formHook;
    const [selectedItemIndex, setSelectedItemIndex] = useState(0);
    const useProjectCreationOptions = useGetProjectCreationOptions();
    const cancelConfirmDisclosure = useDisclosure();

    //#region Mutation handlers
    const onError = (err: HttpError) => {
      onProjectCreation(LoadingState.Error);
      toast.close("creating-project");
      toast({
        title: `Uh oh... Something went wrong :(`,
        description: `${err.message} Please try again later.`,
        status: "error",
        isClosable: true,
        position: "top",
        duration: null,
      });
    };
    const onSuccess = (dto: ProjectGetDto) => {
      onProjectCreation(LoadingState.Loaded);
      if (!toast.isActive("creation-success")) {
        toast.close("creating-project");
        toast({
          id: "creation-success",
          title: `Successfully saved your recipe!`,
          status: "success",
          isClosable: true,
          position: "top",
        });
      }
    };

    const { mutate, isSuccess } = useMutation(
      async (creationDto: ProjectCreateDto) => {
        const projectService = new ProjectCreationService(userStore, uiStore);
        return await projectService.createProject(creationDto);
      },
      {
        onError,
        onSuccess,
      }
    );
    //#endregion

    //#region Upload Handler
    const handleUpload = useCallback(
      (projectData: IProject) => {
        toast({
          id: "creating-project",
          title: (
            <Flex alignItems="center">
              Saving your recipe <Spinner ml="5px" />
            </Flex>
          ),
          status: "info",
          position: "top",
          description: <Flex>Frantically saving your recipe...</Flex>,
        });

        mutate({
          name: projectData.name,
          description: projectData.projectDescription,
          flairId:
            projectData.flair !== "-1" /**i.e. not "None" */
              ? parseInt(projectData.flair!)
              : undefined,
          files: projectData.projectItems.map((x) => {
            return x.mediaAsFile;
          }),
          projectItems: projectData.projectItems.map((item, index) => {
            return {
              heading: "",
              imageUrl: item.mediaUrl,
              imageAlt: "",
              description: item.description,
              order: index,
              imageTags: item.tags.map((tag) => {
                return {
                  id: tag.id ?? undefined,
                  title: tag.title,
                  url: tag.url,
                  width: tag.originalImageSize,
                  xCoordinate: tag.xCoord,
                  yCoordinate: tag.yCoord,
                };
              }),
            };
          }),
        });
        setSelectedItemIndex(0);
        onClose();
      },
      [onClose, toast, mutate]
    );
    //#endregion

    useEffect(() => {
      if (isSuccess) {
        reset(defaultValues);
      }
    }, [isSuccess, reset, defaultValues]);

    return (
      <DrawerTemplate
        closeOnEsc={false}
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        placement="right"
        drawerHeader={
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <IconButton
                title="Cancel"
                onClick={() => {
                  if (
                    JSON.stringify(defaultValues) ===
                    JSON.stringify(formHook.getValues())
                  ) {
                    onClose();
                  } else {
                    cancelConfirmDisclosure.onOpen();
                  }
                }}
                size="md"
                icon={
                  <>
                    <ArrowBackIcon /> Back
                  </>
                }
                aria-label="Cancel"
                variant="unstyled"
              />
            </Box>
            <Box>
              <Text as="div" fontSize={showMobileLayout ? "md" : "lg"}>
                Create Recipe
              </Text>
            </Box>
            <Box>
              <Button
                title="Submit and Create Recipe"
                type="submit"
                form="project-form"
                variant={!showMobileLayout ? "primary" : "unstyled"}
                color={!showMobileLayout ? "#fff" : "primary"}
              >
                <Text as="span">Create!</Text>
              </Button>
            </Box>
          </Box>
        }
      >
        {useProjectCreationOptions.data ? (
          <form
            id="project-form"
            onSubmit={handleSubmit(handleUpload)}
            style={{ height: "100%" }}
          >
            <DrawerLayout
              sidebar={
                <Sidebar
                  projectCreationOptions={useProjectCreationOptions.data}
                  onItemSelect={(selectedItemIndex) => {
                    setSelectedItemIndex(selectedItemIndex);
                  }}
                  formHook={formHook}
                />
              }
            />
          </form>
        ) : (
          <></>
        )}
        <ActionConfirmationModal
          isOpen={cancelConfirmDisclosure.isOpen}
          onCancel={() => {
            cancelConfirmDisclosure.onClose();
          }}
          onConfirm={() => {
            reset();
            onClose();
            cancelConfirmDisclosure.onClose();
          }}
          modalHeading="All unsaved work will be lost. Are you sure?"
          confirmButtonColorScheme="red"
          confirmButtonLabel="Yep, I'm sure"
        />
      </DrawerTemplate>
    );
  }
);
