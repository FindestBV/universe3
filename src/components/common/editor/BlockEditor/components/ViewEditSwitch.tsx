import { setEditingState } from "@/api/documents/documentSlice";
import { RootState } from "@/store";
import { Eye, Pen } from "lucide-react";

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
        className={`flex items-center gap-2 rounded-l-sm border p-1 px-2 text-sm transition-all duration-150 ease-linear ${
          isEditMode
            ? "border-gray-300 bg-white text-gray-700"
            : "border-black bg-[#000000] text-white"
        }`}
        aria-label="Switch to View Mode"
      >
        <Eye size={16} />
      </button>

      <button
        onClick={handleEditStart}
        className={`flex items-center gap-2 rounded-r-sm border px-2 py-1 text-sm transition-all duration-150 ease-linear ${
          isEditMode ? "border-black bg-black text-white" : "border-gray-300 bg-white text-gray-700"
        }`}
        aria-label="Switch to Edit Mode"
      >
        <Pen size={16} />
      </button>
    </div>
  );
};

export default ViewEditSwitch;
