import { Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import { ProjectCreationService } from "../../classes/ProjectCreationService";
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
              },
              (error) => {
                console.log(error);
              }
            );
          }
        }, 800);

        return null;
      });
    }, [project?.projectItems, uiStore, userStore]);

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
