import {
  Button,
  DrawerFooter,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import Compressor from "compressorjs";
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
import { IProjectItem, ProjectItems } from "./ProjectItems";

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
    const formHook = useForm();
    const { handleSubmit, reset } = formHook;

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
          if (item.imageAsFileList && item.imageAsFileList[0]) {
            const promise = new Promise((resolve) => {
              new Compressor(item.imageAsFileList![0], {
                quality: 0.7,
                convertSize: 2000000,
                maxHeight: 1920,
                maxWidth: 1920,
                success: (compressedImage: File) => {
                  item.imageAsFile = compressedImage;
                  item.imageUrl = URL.createObjectURL(compressedImage);
                  resolve(item);
                },
              });
            });
            promise.then(() => {
              setTimeout(() => {
                if (item.imageAsFile) {
                  service.uploadImage(
                    item.imageAsFile,
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
                        item.imageAsFile = undefined;
                        item.imageAsFileList = undefined;
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
            });
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
          name: "new proj",
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
          <ProjectItems formHook={formHook} />
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
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
