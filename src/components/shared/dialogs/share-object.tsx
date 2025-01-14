import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Users } from "lucide-react";

import { useState } from "react";

import AddUsersForm from "../forms/add-users";

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
