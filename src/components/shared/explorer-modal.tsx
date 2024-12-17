import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChartNetwork } from "lucide-react";

import { Button } from "../ui/button";

const ExplorerModal: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button aria-label="Pinned" className="p-2">
          <ChartNetwork width={20} color="black" />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[80vh] max-w-6xl bg-slate-100">
        <div className="flex h-full w-full items-start">
          <h1>EXPLORER MODAL CONTENT HERE.</h1>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExplorerModal;
