import { setEditingState } from "@/api/documents/documentSlice";
import { RootState } from "@/store";
import { Editor } from "@tiptap/core";
import { Eye, FilePenLine } from "lucide-react";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ViewEditSwitchProps {
  id?: string;
  editor?: Editor;
}

const ViewEditSwitch = ({ id, editor }: ViewEditSwitchProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const isEditing = useSelector((state: RootState) => state.document.isEditing);
  const dispatch = useDispatch();

  const handleEditStart = () => {
    if (!id || typeof id !== "string") {
      console.error("Invalid document ID provided:", id);
      return;
    }

    setIsEditMode(true);
    dispatch(setEditingState({ isEditing: true, documentId: id }));
    editor?.setEditable(true);
  };

  const handleStopEditing = () => {
    if (!id || typeof id !== "string") {
      console.error("Invalid document ID provided:", id);
      return;
    }

    setIsEditMode(false);
    dispatch(setEditingState({ isEditing: false, documentId: id }));
    editor?.setEditable(false);
  };

  return (
    <div className="button-group flex items-center">
      <button
        onClick={handleStopEditing}
        className={`flex items-center gap-2 rounded-l-sm border px-2 py-1 transition-all duration-150 ease-linear ${
          !isEditMode
            ? "border-[#FFF000] bg-[#FFF000] text-black"
            : "border-gray-300 bg-white text-gray-700"
        }`}
        aria-label="Switch to View Mode"
      >
        <Eye size={16} />
        VIEW
      </button>

      <button
        onClick={handleEditStart}
        className={`flex items-center gap-2 rounded-r-sm border px-2 py-1 transition-all duration-150 ease-linear ${
          isEditMode
            ? "border-[#84A7E2] bg-[#84A7E2] text-white"
            : "border-gray-300 bg-white text-gray-700"
        }`}
        aria-label="Switch to Edit Mode"
      >
        <FilePenLine size={16} />
        EDIT
      </button>
    </div>
  );
};

export default ViewEditSwitch;
