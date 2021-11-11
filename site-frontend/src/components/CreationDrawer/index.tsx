import { Button, Flex, Spinner, useToast, Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { ProjectCreationService } from "../../classes/ProjectCreationService";
import { HttpError } from "../../Dtos/HttpError.dto";
import { ProjectCreateDto } from "../../Dtos/ProjectCreateDto.dto";
import { ProjectGetDto } from "../../Dtos/ProjectGetDto.dto";
import { LoadingState } from "../../enums/LoadingState";
import { useGetProjectCreationOptions } from "../../hooks/useGetProjectCreationOptions";
import { UseStores } from "../../stores/StoreContexts";
import { DrawerTemplate } from "../DrawerTemplate";
import { DrawerLayout } from "./DrawerLayout";
import { MediaArea } from "./MediaArea";
import { IProjectItem } from "./ProjectItems";
import { Sidebar } from "./Sidebar";

export interface IProject {
  name: string;
  flair?: string;
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
    const useProjectCreationOptions = useGetProjectCreationOptions();

    //#region Mutation handlers
    const onError = (err: HttpError) => {
      onProjectCreation(LoadingState.Loaded);
      toast.close("creating-project");
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
              Creating your project <Spinner ml="5px" />
            </Flex>
          ),
          status: "info",
          position: "top",
          description: <Flex>Frantically generating your project...</Flex>,
        });

        mutate({
          name: projectData.name,
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
          <Box display="flex" justifyContent="center">
            Add New Project
          </Box>
        }
      >
        {useProjectCreationOptions.data ? (
          <form onSubmit={handleSubmit(handleUpload)}>
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
              contentArea={
                <MediaArea
                  formHook={formHook}
                  selectedItemIndex={selectedItemIndex}
                />
              }
              footer={
                <>
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
                </>
              }
            />
          </form>
        ) : (
          <></>
        )}
      </DrawerTemplate>
    );
  }
);
