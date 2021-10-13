import { Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { ProjectCreationService } from "../../classes/ProjectCreationService";
import { UseStores } from "../../stores/StoreContexts";
import { DrawerTemplate } from "../DrawerTemplate";
import { IProjectItem } from "./ItemModal";
import { ProjectItems } from "./ProjectItems";

interface IProject {
  projectItems: IProjectItem[];
}

interface ICreationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreationDrawer = observer(
  ({ isOpen, onClose }: ICreationDrawerProps) => {
    const { userStore, uiStore } = UseStores();
    const service = new ProjectCreationService(userStore, uiStore);

    const [project, setProject] = useState<IProject>();

    const handleUpload = () => {
      project?.projectItems.flatMap((item) => {
        if (item.image) {
          return service.uploadImage(
            item.image,
            (progress) => {
              console.log(progress);
            },
            (url) => {
              console.log(url);
            },
            (error) => {
              console.log(error);
            }
          );
        }
        return null;
      });
    };
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
          onChange={(newItems) => {
            setProject((prev) => {
              return {
                ...prev,
                projectItems: newItems,
              };
            });
          }}
        />
      </DrawerTemplate>
    );
  }
);
