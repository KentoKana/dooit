import { Box, Button, Portal, useToast } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import { useMutation } from "react-query";
import { ProjectCreationService } from "../../classes/ProjectCreationService";
import { HttpError } from "../../Dtos/HttpError.dto";
import { ProjectCreateDto } from "../../Dtos/ProjectCreateDto.dto";
import { ProjectGetDto } from "../../Dtos/ProjectGetDto.dto";
import { UseStores } from "../../stores/StoreContexts";
import { DrawerTemplate } from "../DrawerTemplate";
import { IProjectItem } from "./ItemModal";
import { ProjectItems } from "./ProjectItems";

export interface IProject {
  projectItems: IProjectItem[];
}

interface ICreationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreationDrawer = observer(
  ({ isOpen, onClose }: ICreationDrawerProps) => {
    const { userStore, uiStore } = UseStores();
    const toast = useToast();
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
      toast({
        title: `Successfully created project!`,
        status: "success",
        isClosable: true,
        position: "top",
      });
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

    const [project, setProject] = useState<IProject>({ projectItems: [] });

    const handleUpload = useCallback(() => {
      const service = new ProjectCreationService(userStore, uiStore);
      project?.projectItems.flatMap((item) => {
        setTimeout(() => {
          if (item.image) {
            service.uploadImage(
              item.image,
              (progress) => {
                item.progress = progress;
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
              },
              (url) => {
                let projectToCreate = new ProjectCreateDto();
                setProject((prev) => {
                  prev.projectItems.forEach((prevItemState) => {
                    if (prevItemState.order === item.order) {
                      prevItemState.image = undefined;
                      prevItemState.imageUrl = url;
                      prevItemState.progress = undefined;
                    }
                  });
                  projectToCreate = {
                    name: "test creating this project",
                    projectItems: prev.projectItems,
                  };
                  return {
                    ...prev,
                  };
                });
                mutate(projectToCreate);
              },
              (error) => {
                console.log(error);
              }
            );
          }
        }, 800);

        return null;
      });
    }, [project?.projectItems, uiStore, userStore, mutate]);

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
