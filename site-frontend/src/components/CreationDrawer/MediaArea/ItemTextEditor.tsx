import { UseFormReturn, useWatch } from "react-hook-form";
import { IProject } from "..";
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
        placeholder="✍️ Tell us something interesting about this item..."
        className="chakra-textarea css-1dt1p6p"
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
      <Textarea
        background="#fff"
        hidden
        _focus={{
          outline: ["none", "none", "initial"],
        }}
        border={["none", "none", "1px solid"]}
        borderColor={"grey.100"}
        borderRadius="sm"
        minHeight="180px"
        maxHeight="250px"
        resize="none"
      />
    </>
  );
};