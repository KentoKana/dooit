import { Button, Flex, Spinner, useToast } from "@chakra-ui/react";
import Compressor from "compressorjs";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { ProjectCreationService } from "../../classes/ProjectCreationService";
import { HttpError } from "../../Dtos/HttpError.dto";
import { ProjectCreateDto } from "../../Dtos/ProjectCreateDto.dto";
import { ProjectGetDto } from "../../Dtos/ProjectGetDto.dto";
import { LoadingState } from "../../enums/LoadingState";
import { UseStores } from "../../stores/StoreContexts";
import { DrawerTemplate } from "../DrawerTemplate";
import { IProjectItem } from "./ItemModal";
import { ProjectItems } from "./ProjectItems";

export interface IProject {
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

    const [project, setProject] = useState<IProject>({ projectItems: [] });
    const [progressCounter, setProgressCounter] = useState<number>(0);

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
        setProject({ projectItems: [] });
      }
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
    const handleUpload = useCallback(() => {
      onClose();
      const service = new ProjectCreationService(userStore, uiStore);
      project?.projectItems.flatMap((item) => {
        const promise = new Promise((resolve) => {
          new Compressor(item.image!, {
            quality: 0.7,
            convertSize: 2000000,
            maxHeight: 1920,
            maxWidth: 1920,
            success: (compressedImage: File) => {
              item.image = compressedImage;
              item.imageUrl = URL.createObjectURL(compressedImage);
              resolve(item);
            },
          });
        });
        promise.then(() => {
          setTimeout(() => {
            if (item.image) {
              service.uploadImage(
                item.image,
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
                    setProject((prev) => {
                      prev.projectItems.forEach((prevItemState) => {
                        if (prevItemState.order === item.order) {
                          prevItemState.image = undefined;
                          prevItemState.imageUrl = url;
                          prevItemState.progress = undefined;
                        }
                      });
                      return {
                        ...prev,
                      };
                    });
                  }
                },
                //#endregion
                //#region On upload error
                (error) => {
                  console.log(error);
                }
                //#endregion
              );
            } else {
              setProgressCounter((prev) => {
                return (prev += 1);
              });
            }
          }, 800);
        });
        return null;
      });
    }, [project, uiStore, userStore, onClose, toast, onProjectCreation]);
    //#endregion

    // Submit data once all project items have been processed.
    useEffect(() => {
      if (
        progressCounter === project.projectItems.length &&
        project.projectItems.length !== 0
      ) {
        mutate({
          name: "new proj",
          projectItems: project.projectItems,
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
        drawerFooter={
          <>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleUpload}>
              Save
            </Button>
          </>
        }
      >
        <ProjectItems
          projectState={project}
          onChange={(newProjectState) => {
            setProject(newProjectState);
          }}
        />
      </DrawerTemplate>
    );
  }
);
