import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { useEffect, useState } from "react";
import "./style.css";
import { UseFormReturn } from "react-hook-form";
import { IProject } from ".";
import { useDebounce } from "../../hooks/useDebounce";

interface IItemTextEditor {
  selectedItemIndex: number;
  formHook: UseFormReturn<IProject, object>;
}

export const ItemTextEditor = ({
  selectedItemIndex,
  formHook,
}: IItemTextEditor) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText(""))
  );
  const debouncedEditorState = useDebounce(editorState);

  useEffect(() => {
    formHook.setValue(
      `projectItems.${selectedItemIndex}.description`,
      draftToHtml(convertToRaw(debouncedEditorState.getCurrentContent()))
    );
    console.log(
      draftToHtml(convertToRaw(debouncedEditorState.getCurrentContent()))
    );
  }, [debouncedEditorState, formHook, selectedItemIndex]);
  return (
    <Editor
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      toolbar={{
        options: ["inline", "list", "link", "emoji"],
        inline: {
          inDropdown: false,
          className: undefined,
          component: undefined,
          dropdownClassName: undefined,
          options: [
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "monospace",
          ],
        },
      }}
      onEditorStateChange={(value) => {
        setEditorState(value);
      }}
    />
  );
};
