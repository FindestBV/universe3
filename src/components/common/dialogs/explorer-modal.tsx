import ExplorerDataViewModal from "@/components/common/utilities/explorer-data-view-modal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChartNetwork } from "lucide-react";

const ExplorerModal: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button aria-label="Explore">
          <ChartNetwork width={20} color="black" />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[80vh] max-w-6xl bg-white">
        <ExplorerDataViewModal />
      </DialogContent>
    </Dialog>
  );
};

export default ExplorerModal;
