import { setEditingState } from "@/api/documents/documentSlice";
import { RootState } from "@/store";
import { Eye, FilePenLine } from "lucide-react";

import { useState } from "react";
// Replace with the actual imports if different
import { useDispatch, useSelector } from "react-redux";

const ViewEditSwitch = ({ id }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const isEditing = useSelector((state: RootState) => state.document.isEditing);

  const dispatch = useDispatch();

  const handleEditStart = () => {
    console.log("Editing started for document:", id);
    console.log(isEditing);
    setIsEditMode((prev) => !prev);
    // Validate `id`
    if (!id || typeof id !== "string") {
      console.error("Invalid document ID provided:", id);
      return;
    }

    // Dispatch with the correct payload
    dispatch(setEditingState({ isEditing: true, documentId: id }));
  };

  const handleStopEditing = () => {
    console.log("Editing stopped for document:", id);
    console.log(isEditing);
    setIsEditMode((prev) => !prev);
    // Validate `id`
    if (!id || typeof id !== "string") {
      console.error("Invalid document ID provided:", id);
      return;
    }

    dispatch(setEditingState({ isEditing: true, documentId: id }));
  };

  return (
    <div className="button-group flex items-center">
      <button
        onClick={handleStopEditing}
        className={`flex items-center gap-2 rounded-l-sm border px-2 py-1 transition-all duration-150 ease-linear ${
          isEditMode
            ? "border-gray-300 bg-white text-gray-700"
            : "border-yellow-500 bg-yellow-500 text-white"
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
