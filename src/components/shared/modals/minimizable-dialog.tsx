import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Minus } from "lucide-react";

import { useState } from "react";

const MinimizableDialog = () => {
  const [isOpen, setIsOpen] = useState(false); // Track dialog visibility
  const [isMinimized, setIsMinimized] = useState(false); // Track minimized state

  const handleToggleMinimized = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <>
      {/* Normal trigger for opening the dialog */}
      {!isMinimized && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="btn">Open Dialog</DialogTrigger>
          <DialogContent className="h-auto max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-lg">
            <DialogHeader>
              <div className="flex justify-between">
                <DialogTitle>Dialog Title</DialogTitle>
                <div>
                  <button
                    onClick={handleToggleMinimized}
                    className="mr-4 rounded border px-2 py-1 text-sm text-gray-500 hover:bg-gray-200"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              </div>
            </DialogHeader>
            <div>
              <p>This is the dialog content. You can minimize this dialog.</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Minimized dialog */}
      {isMinimized && (
        <div
          className="fixed bottom-4 right-4 flex h-12 w-1/4 cursor-pointer items-center justify-between bg-[#3B82F6] px-4 text-white shadow-lg"
          onClick={handleToggleMinimized}
        >
          <p className="text-sm text-white">Dialog (Minimized)</p>
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
              handleToggleMinimized();
            }}
            className="text-sm text-blue-800"
          >
            Restore
          </button>
        </div>
      )}
    </>
  );
};

export default MinimizableDialog;
