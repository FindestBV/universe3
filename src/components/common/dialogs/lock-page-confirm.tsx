import { setLockPage } from "@/api/documents/documentSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lock, LockOpen } from "lucide-react";

import { useState } from "react";
import { useDispatch } from "react-redux";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LockPageConfirm = ({ id, isLocked }: any) => {
  console.log("lock page", isLocked);
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirm = (id: string) => {
    dispatch(setLockPage({ isLocked: !isLocked, documentId: id }));
    setIsDialogOpen(false); // Close the dialog after the action
  };

  return (
    <>
      {/* Trigger Button */}
      <Button onClick={() => setIsDialogOpen(true)} className="p-2">
        {!isLocked ? (
          <LockOpen
            size={36}
            className="text-yellow-700 hover:text-white"
            onClick={() => handleConfirm(id)}
          />
        ) : (
          <Lock
            size={36}
            className="hove:text-white text-red-700"
            onClick={() => handleConfirm(id)}
          />
        )}
      </Button>

      {/* Confirmation Dialog */}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="h-auto max-w-2xl overflow-auto rounded-lg bg-white p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle>
              <h2 className={"font-bold"}>{isLocked ? "Unlock Page?" : "Lock Page?"}</h2>
            </DialogTitle>
          </DialogHeader>
          <p>
            {isLocked
              ? `Are you sure you want to unlock this page? id: ${id}`
              : `Are you sure you want to lock this page?`}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={handleConfirm} className="text-white">
              {isLocked ? "Unlock" : "Lock"}
            </Button>

            <Button
              variant="destructive"
              onClick={() => setIsDialogOpen(false)}
              className="text-white"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LockPageConfirm;
