/**
 * LinkDocuments Component
 *
 * This component allows users to **connect an existing entity or study** to an active item.
 * It provides functionality to:
 *
 * - **Display the current parent entity** the connection is being made from.
 * - **Select a relationship type** (default: "is a child of").
 * - **Input a name** for the new link.
 * - **Attach the entity to the specified parent**.
 * - **Cancel the operation**, resetting input fields.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.attachToItem - Function to attach an entity to the parent item.
 * @param {string} props.parentId - The ID of the parent item (study/entity).
 * @param {string} props.parentTitle - The title of the parent item.
 * @param {React.ReactNode} props.triggerButton - Custom trigger button component.
 * @param {Object} props.triggerButtonProps - Additional props for the custom trigger button.
 *
 * @example
 * <LinkDocuments
 *   attachToItem={(id) => console.log("Entity attached to:", id)}
 *   parentId="study-123"
 *   parentTitle="AI Research Study"
 *   triggerButton={<Button className="flex items-center gap-1 rounded border border-slate-300 bg-slate-100 px-4 font-bold text-black transition-colors duration-200 hover:bg-slate-200">
 *     <Link className="p-1" /> Link sources
 *   </Button>}
 *   triggerButtonProps={{}}
 * />
 *
 * @dependencies
 * - **ShadCN UI Components**: Dialog, DialogTrigger, DialogContent, Button
 * - **React Hooks**: useState (for managing modal state & form input)
 *
 * @returns {JSX.Element} The rendered LinkDocuments component.
 */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "lucide-react";

import React from "react";
import { useState } from "react";

export const LinkedDocumentsAndPapers = ({ triggerButton, dialogType, dialogContent }) => {
  const [relationship, setRelationship] = useState("child");
  const [linkName, setLinkName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = () => {
    setRelationship("child"); // Reset dropdown
    setLinkName(""); // Reset input field
    setIsOpen(false); // Close the modal
  };

  const handleSave = () => {
    // Add save functionality here
    setIsOpen(false); // Close modal after save
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton ? (
          React.cloneElement(triggerButton, { onClick: () => setIsOpen(true) })
        ) : (
          <Button className="flex items-center gap-1 rounded border border-slate-300 bg-slate-100 px-4 font-bold text-black transition-colors duration-200 hover:bg-slate-200">
            <Link className="p-1" /> Link sources
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="h-auto max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-lg">
        {/* Modal Header */}
        <h2 className="mb-4 text-lg font-bold">{dialogType ? dialogType : `Link to Item`}</h2>
        {dialogContent ? dialogContent : "render relevant dialog here"}
        {/* Current Item Title */}
        <div className="mb-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Add link from:</label>
          <p className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900">
            Document Title
          </p>
        </div>

        {/* Select Relationship */}
        <div className="mb-2">
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="relationship">
            Select relationship:
          </label>
          <select
            id="relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="child">is a child of</option>
          </select>
        </div>

        {/* Name Input Field */}
        <div className="mb-2">
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="linkName">
            Name:
          </label>
          <input
            type="text"
            id="linkName"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Enter link name"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-start gap-4">
          <button
            onClick={handleSave}
            className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkedDocumentsAndPapers;
