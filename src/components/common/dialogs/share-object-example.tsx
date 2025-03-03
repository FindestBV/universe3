import { useState } from "react";

import GenericDialog from "./generic-dialog";

export const ShareObjectExample: React.FC<{
  parentId: string;
  parentTitle: string;
}> = ({ parentId, parentTitle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = (data: any) => {
    console.log("Share dialog confirmed with data:", data);
    // Handle share logic here
  };

  const handleCancel = () => {
    console.log("Share dialog cancelled");
    // Handle cancel logic here
  };

  return (
    <GenericDialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      variant="share"
      title="Share"
      parentId={parentId}
      parentTitle={parentTitle}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      initialData={{
        users: [],
        shareThisObject: true,
        shareLinkedObjects: false,
      }}
    />
  );
};

export default ShareObjectExample;
