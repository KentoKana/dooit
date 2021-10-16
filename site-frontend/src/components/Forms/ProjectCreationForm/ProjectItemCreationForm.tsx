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
    const [mediaFile, setMediaFile] = useState<File>();
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
          quality: 0.7,
          convertSize: 2000000,
          maxHeight: 1920,
          maxWidth: 1920,
          success: (compressedImage: File) => {
            setMediaFile(compressedImage);
          },
        });
      }
    };

    const onSubmit = useCallback(
      async (formData: IProjectItem) => {
        formData = {
          ...formData,
          image: mediaFile,
          imageUrl: previewUrl,
        };
        onItemCreate(formData);
        onClose();
      },
      [onClose, onItemCreate, mediaFile, previewUrl]
    );

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormElement
          formLabel="Image"
          formFor={"image"}
          isInvalid={errors.image}
          formField={
            <Input
              accept="image/*"
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
          formLabel="Title"
          formFor={"title"}
          isInvalid={errors.title}
          formField={
            <Input
              id="title"
              placeholder="Title"
              borderRadius={2}
              {...register("title")}
            />
          }
        />
        <FormElement
          formLabel="Description"
          formFor={"description"}
          isInvalid={errors.description}
          formField={
            <Textarea
              id="description"
              placeholder="Description"
              borderRadius={2}
              {...register("description")}
            />
          }
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
