import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromHTML,
} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { useEffect, useRef, useState } from "react";
import "./style.css";
import { UseFormReturn, useWatch } from "react-hook-form";
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
  const watchProjectItems = useWatch({
    name: `projectItems`,
    control: formHook.control,
  });
  const blocksFromHTML = convertFromHTML(
    watchProjectItems[selectedItemIndex]?.description ?? ""
  );
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createWithContent(
      watchProjectItems[selectedItemIndex]?.description
        ? state
        : ContentState.createFromText("")
    )
  );
  const debouncedEditorState = useDebounce(editorState);

  const selectedItemIndexRef = useRef(selectedItemIndex);

  useEffect(() => {
    formHook.setValue(
      `projectItems.${selectedItemIndex}.description`,
      draftToHtml(convertToRaw(debouncedEditorState.getCurrentContent()))
    );
  }, [debouncedEditorState, formHook, selectedItemIndex]);

  // Rerender Wysiwyg editor content when selected item index changes.
  useEffect(() => {
    if (selectedItemIndexRef.current !== selectedItemIndex) {
      setEditorState(
        EditorState.createWithContent(
          watchProjectItems[selectedItemIndex]?.description
            ? state
            : ContentState.createFromText("")
        )
      );
      selectedItemIndexRef.current = selectedItemIndex;
    }
  }, [selectedItemIndexRef, watchProjectItems, selectedItemIndex, state]);

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
