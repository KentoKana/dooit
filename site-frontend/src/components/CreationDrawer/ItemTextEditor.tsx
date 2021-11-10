import { UseFormReturn, useWatch } from "react-hook-form";
import { IProject } from ".";
import { Textarea, chakra } from "@chakra-ui/react";
import { DebounceInput } from "react-debounce-input";
const DebouncedTextInput = chakra(DebounceInput, { baseStyle: {} });
interface IItemTextEditor {
  selectedItemIndex: number;
  formHook: UseFormReturn<IProject, object>;
}

export const ItemTextEditor = ({
  selectedItemIndex,
  formHook,
}: IItemTextEditor) => {
  const watchItem = useWatch({
    name: "projectItems",
    control: formHook.control,
  });

  return (
    <>
      <DebouncedTextInput
        placeholder="Tell us something interesting about this item..."
        resize="none"
        minHeight="190px"
        className="css-j9fgrv"
        element="textarea"
        debounceTimeout={300}
        value={
          (watchItem[selectedItemIndex] &&
            watchItem[selectedItemIndex].description) ??
          ""
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          formHook.setValue(
            `projectItems.${selectedItemIndex}.description`,
            e.target.value
          );
        }}
      />
      <Textarea hidden borderRadius="sm" />
    </>
  );
};
