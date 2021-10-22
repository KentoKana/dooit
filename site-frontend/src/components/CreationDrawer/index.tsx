import {
  Box,
  Button,
  DrawerFooter,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { ProjectCreationService } from "../../classes/ProjectCreationService";
import { HttpError } from "../../Dtos/HttpError.dto";
import { ProjectCreateDto } from "../../Dtos/ProjectCreateDto.dto";
import { ProjectGetDto } from "../../Dtos/ProjectGetDto.dto";
import { LoadingState } from "../../enums/LoadingState";
import { UseStores } from "../../stores/StoreContexts";
import { DrawerTemplate } from "../DrawerTemplate";
import { MediaArea } from "./MediaArea";
import { IProjectItem } from "./ProjectItems";
import { Sidebar } from "./Sidebar";

export interface IProject {
  name: string;
  projectItems: IProjectItem[];
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
    const formHook = useForm<object>({
      defaultValues: {
        name: "",
        projectItems: [
          {
            title: "",
            description: "",
            order: 0,
          },
        ],
      },
    });
    const { handleSubmit, reset } = formHook;

    const [project, setProject] = useState<IProject>({
      name: "",
      projectItems: [],
    });
    const [progressCounter, setProgressCounter] = useState<number>(0);
    const [selectedItemIndex, setSelectedItemIndex] = useState(0);

    //#region Mutation handlers
    const onError = (err: HttpError) => {
      toast({
        title: `Uh oh... :(`,
        description: err.message,
        status: "error",
        isClosable: true,
        position: "top",
      });
    };
    const onSuccess = (dto: ProjectGetDto) => {
      onProjectCreation(LoadingState.Loaded);
      if (!toast.isActive("creation-success")) {
        toast.close("creating-project");
        toast({
          id: "creation-success",
          title: `Successfully created project!`,
          status: "success",
          isClosable: true,
          position: "top",
        });
        setProject({ name: dto.name, projectItems: [] });
      }
      reset();
    };
    const { mutate } = useMutation(
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
        onClose();
        const service = new ProjectCreationService(userStore, uiStore);
        projectData?.projectItems.flatMap((item) => {
          if (item.mediaAsFile) {
            setTimeout(() => {
              if (item.mediaAsFile) {
                service.uploadImage(
                  item.mediaAsFile,
                  //#region On upload progress
                  (progress) => {
                    onProjectCreation(LoadingState.Loading);
                    setProject((prev) => {
                      prev.projectItems.forEach((prevItemState) => {
                        if (prevItemState.order === item.order) {
                          prevItemState.progress = progress;
                        }
                      });
                      return {
                        ...prev,
                      };
                    });

                    if (!toast.isActive("creating-project")) {
                      toast({
                        id: "creating-project",
                        title: (
                          <Flex alignItems="center">
                            Creating your project <Spinner ml="5px" />
                          </Flex>
                        ),
                        status: "info",
                        isClosable: true,
                        position: "top",
                        description: (
                          <Flex>Frantically generating your project...</Flex>
                        ),
                      });
                    }
                  },
                  //#endregion
                  //#region On upload completion
                  (url) => {
                    if (url) {
                      setProgressCounter((prev) => {
                        return (prev += 1);
                      });
                      item.mediaAsFile = undefined;
                      item.mediaAsFile = undefined;
                      item.imageUrl = url;
                      item.progress = undefined;
                    }
                  },
                  //#endregion
                  //#region On upload error
                  (error) => {
                    console.log(error);
                  }
                  //#endregion
                );
              }
            }, 800);
          } else {
            setProgressCounter((prev) => {
              return (prev += 1);
            });
          }
          setProject(projectData);
          return null;
        });
      },
      [uiStore, userStore, onClose, toast, onProjectCreation]
    );
    //#endregion

    // Submit data once all project items have been processed.
    useEffect(() => {
      if (
        progressCounter === project.projectItems.length &&
        project.projectItems.length !== 0
      ) {
        mutate({
          name: project.name,
          projectItems: project.projectItems.map((item) => {
            return {
              heading: "",
              imageUrl: item.imageUrl,
              imageAlt: "",
              description: item.description,
            };
          }),
        });
        setProgressCounter(0);
      }
    }, [progressCounter, project, mutate]);

    return (
      <DrawerTemplate
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        placement="right"
        drawerHeader="Create Project"
      >
        <form onSubmit={handleSubmit(handleUpload)}>
          <Flex
            justifyContent="between"
            width="100%"
            maxWidth="1200px"
            margin="auto"
          >
            <Box width="25%" mr={["40px"]} as="section">
              <Sidebar
                onItemSelect={(selectedItemIndex) => {
                  setSelectedItemIndex(selectedItemIndex);
                }}
                formHook={formHook}
              />
            </Box>
            <Flex width="75%" as="section" justifyContent="center">
              <MediaArea
                formHook={formHook}
                selectedItemIndex={selectedItemIndex}
              />
            </Flex>
          </Flex>
          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                formHook.reset();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit">
              Save
            </Button>
          </DrawerFooter>
        </form>
      </DrawerTemplate>
    );
  }
);
