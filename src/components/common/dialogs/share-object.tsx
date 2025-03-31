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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Download, File, Forward, Plus } from "lucide-react";

import { useState } from "react";

export const ShareObject: React.FC<{
  parentId: string;
  parentTitle: string;
}> = ({ parentId, parentTitle }) => {
  const [relationship, setRelationship] = useState("child");
  const [linkName, setLinkName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 rounded border border-slate-300 bg-slate-100 px-2 text-sm text-black transition-colors duration-200 hover:bg-slate-200">
          <Forward size={16} className="font-black" />
          {/* Share */}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-auto max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-lg">
        {/* Modal Header */}
        <h2 className="mb-2 text-lg font-bold">Share Page</h2>

        <Label htmlFor="optionalMessage" className="font-bold">
          Invite viewers by adding their email address
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            className="border border-slate-200 bg-white"
            placeholder="viewer@email.com"
          />
          <div className="rounded-sm border border-slate-200 p-1.5">
            <Plus className="p-1" size={24} />
          </div>
        </div>

        <Label htmlFor="optionalMessage" className="font-bold">
          Message (optional)
        </Label>
        <Textarea
          id="optionalMessage"
          placeholder="Type your message here..."
          className="min-h-[120px] resize-none border border-slate-200 bg-white pr-12"
        />

        <Button className="w-1/4 bg-slate-200 p-2">Add viewer</Button>

        <Separator />

        <h3 className="mb-2 text-sm font-bold">Other share options</h3>
        <div className="flex flex-col gap-2">
          <Button className="flex w-1/6 items-center justify-start gap-2 rounded bg-slate-100 px-2 text-sm text-black transition-colors duration-200 hover:bg-slate-200">
            <File size={16} />
            Copy URL
          </Button>

          <Button className="flex w-1/3 items-center justify-start gap-2 rounded bg-slate-100 px-2 text-sm text-black transition-colors duration-200 hover:bg-slate-200">
            <Download size={16} />
            Export page to Word/PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareObject;
