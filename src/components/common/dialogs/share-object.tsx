/**
 * ShareObject Component (WIP)
 *
 * This component provides a **modal interface** to enable project visibility sharing
 * with other users. It allows users to:
 *
 * - **Add users** to share the project with.
 * - **Manage sharing settings** (toggle visibility for the project and linked objects).
 * - **Modify relationships** within the shared environment.
 *
 * ## Features:
 * - **User selection form** via `AddUsersForm` to specify collaborators.
 * - **Toggle-based settings** for sharing visibility.
 * - **Dynamic modal controlled by state**.
 * - **Expandable for role-based permissions** in future updates.
 *
 * ## Customization:
 * - **Modify default sharing settings** inside the `Switch` components.
 * - **Extend permissions logic** for finer access control.
 * - **Integrate backend API** to persist sharing preferences.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.parentId - The ID of the parent project/entity being shared.
 * @param {string} props.parentTitle - The title of the parent project/entity.
 *
 * @example
 * <ShareObject parentId="project-123" parentTitle="AI Research Project" />
 *
 * @dependencies
 * - **ShadCN UI Components**: Dialog, DialogTrigger, DialogContent, Button, Switch, Label.
 * - **Lucide Icons**: Users.
 * - **React Hooks**: `useState` for managing modal state.
 *
 * @returns {JSX.Element} The rendered ShareObject component.
 */
import AddUsersForm from "@/components/common/forms/add-users";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Users } from "lucide-react";

import { useState } from "react";

export const ShareObject: React.FC<{
  parentId: string;
  parentTitle: string;
}> = ({ parentId, parentTitle }) => {
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
        <Button>
          <Users size={16} />
          SHARE
        </Button>
      </DialogTrigger>
      <DialogContent className="h-auto max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-lg">
        {/* Modal Header */}
        <h2 className="mb-2 text-lg font-bold">Share</h2>

        {/* Current Item Title */}
        <AddUsersForm />

        {/* Select Relationship */}
        <div className="mb-2">
          <h2 className="mb-4 text-lg font-bold">Settings</h2>

          <div className="mb-2 flex items-center space-x-2">
            <Switch id="share-this-object" defaultChecked />
            <Label htmlFor="share-this-object">Share this object</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="share-objects-linked-to-this-object" />
            <Label htmlFor="share-objects-linked-to-this-object">
              Share objects linked to this object
            </Label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareObject;
