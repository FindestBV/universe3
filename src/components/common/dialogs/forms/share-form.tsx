import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { ShareFormData } from "../types";
import AddUsersForm from "./add-users";

interface ShareFormProps {
  data: ShareFormData;
  onChange: (data: ShareFormData) => void;
}

export const ShareForm: React.FC<ShareFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof ShareFormData, value: boolean) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <>
      <AddUsersForm users={data.users} onChange={(users) => onChange({ ...data, users })} />
      <div className="mb-2">
        <h2 className="mb-4 text-lg font-bold">Settings</h2>
        <div className="mb-2 flex items-center space-x-2">
          <Switch
            id="share-this-object"
            checked={data.shareThisObject}
            onCheckedChange={(checked) => handleChange("shareThisObject", checked)}
          />
          <Label htmlFor="share-this-object">Share this object</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="share-objects-linked-to-this-object"
            checked={data.shareLinkedObjects}
            onCheckedChange={(checked) => handleChange("shareLinkedObjects", checked)}
          />
          <Label htmlFor="share-objects-linked-to-this-object">
            Share objects linked to this object
          </Label>
        </div>
      </div>
    </>
  );
};

export default ShareForm;
