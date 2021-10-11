import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { Flex, Textarea } from "@chakra-ui/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import { FormElement } from "../FormElement";

export interface IProjectForm {
  title: string;
  description: string;
}

interface IProjectCreationFormProps {
  onCreate: (newProjectItem: IProjectForm) => void;
  onClose: () => void;
}
export const ProjectCreationForm = observer(
  ({ onCreate, onClose }: IProjectCreationFormProps) => {
    const {
      handleSubmit,
      register,
      formState: { errors, isSubmitting },
    } = useForm();
    //#region Local States

    //#endregion
    const onSubmit = useCallback(
      async (formData: IProjectForm) => {
        onCreate(formData);
        onClose();
      },
      [onClose, onCreate]
    );

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormElement
          isRequired
          formLabel="Title"
          formFor={"title"}
          isInvalid={errors.title}
          formField={
            <Input
              id="title"
              placeholder="Title"
              borderRadius={2}
              {...register("title", {
                required: "Please enter a title.",
              })}
            />
          }
          errorMessage={errors.title && errors.title.message}
        />
        <FormElement
          isRequired
          formLabel="Description"
          formFor={"description"}
          isInvalid={errors.description}
          formField={
            <Textarea
              id="description"
              placeholder="Description"
              borderRadius={2}
              {...register("description", {
                required: "Please enter a description.",
              })}
            />
          }
          errorMessage={errors.description && errors.description.message}
        />
        <Flex justifyContent="space-between" width="100%" my={5}>
          <Button borderRadius={2} onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            isLoading={isSubmitting}
            borderRadius={2}
            variant="primary"
            type="submit"
          >
            Save Item
          </Button>
        </Flex>
      </form>
    );
  }
);
