import {
  Box,
  Button,
  DrawerFooter,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo, useState } from "react";
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
    const defaultValues = useMemo(() => {
      return {
        name: "",
        projectItems: [
          {
            title: "",
            description: "",
            order: 0,
          },
        ],
      };
    }, []);
    const formHook = useForm<IProject>({
      defaultValues: defaultValues,
    });
    const { handleSubmit, reset } = formHook;
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
    const handleUpload = useCallback(
      (projectData: IProject) => {
        onClose();
        toast({
          id: "creating-project",
          title: (
            <Flex alignItems="center">
              Creating your project <Spinner ml="5px" />
            </Flex>
          ),
          status: "info",
          position: "top",
          description: <Flex>Frantically generating your project...</Flex>,
        });
        mutate({
          name: projectData.name,
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
            };
          }),
        });
        setSelectedItemIndex(0);
        reset(defaultValues);
      },
      [onClose, toast, reset, mutate, defaultValues]
    );
    //#endregion

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
            <Flex
              width="75%"
              as="section"
              justifyContent="center"
              direction="column"
              alignItems="center"
            >
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
                reset();
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
