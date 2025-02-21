import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronRight } from "lucide-react";

import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ProjectSearchDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="group h-auto w-full justify-between bg-slate-100 p-2 hover:bg-slate-400"
      >
        <div className="flex items-start gap-4">
          <div className="text-left">
            <h3 className="font-medium group-hover:text-white">Extract Information</h3>
          </div>
        </div>
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Confirmation Dialog */}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="h-auto max-w-2xl overflow-auto rounded-lg bg-white p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle>Some blurb hhere.</DialogTitle>
          </DialogHeader>

          <DialogFooter>text</DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectSearchDialog;
