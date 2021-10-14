import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { Flex, Textarea } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import { FormElement } from "../FormElement";
import Compressor from "compressorjs";
import { IProjectItem } from "../../CreationDrawer/ItemModal";

interface IProjectItemCreationFormProps {
  onItemCreate: (newProjectItem: IProjectItem) => void;
  onClose: () => void;
}
export const ProjectItemCreationForm = observer(
  ({ onItemCreate, onClose }: IProjectItemCreationFormProps) => {
    const [image, setImage] = useState<File>();
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const {
      handleSubmit,
      register,
      formState: { errors, isSubmitting },
    } = useForm();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e && e.target && e.target.files && e.target.files?.length !== 0) {
        setPreviewUrl(URL.createObjectURL(e.target.files[0]));
        new Compressor(e.target.files[0], {
          quality: 0.8,
          success: (compressedImage: File) => {
            setImage(compressedImage);
          },
        });
      }
    };

    const onSubmit = useCallback(
      async (formData: IProjectItem) => {
        formData = {
          ...formData,
          image: image,
          imageUrl: previewUrl,
        };
        onItemCreate(formData);
        onClose();
      },
      [onClose, onItemCreate, image, previewUrl]
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
          formLabel="Image"
          formFor={"image"}
          isInvalid={errors.image}
          formField={
            <Input
              id="image"
              type="file"
              placeholder="Select file"
              borderRadius={2}
              onChange={(e) => {
                handleChange(e);
              }}
              multiple
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
            Add Item
          </Button>
        </Flex>
      </form>
    );
  }
);
