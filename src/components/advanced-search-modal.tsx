import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";

const AdvancedSearchModal: React.FC = () => {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <button className="w-full flex items-center gap-2 px-1 py-2 text-sm text-gray-300 hover:text-gray-500">
            <Calendar className="h-4" />
            <span>Advanced Search</span>
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[80vh] bg-slate-100">
        <div className="w-full h-full flex items-start">
          {/* {user ? `${user} - state in modal` : null} */}
          <iframe
            src="https://use-ui.findest.com/?email=ronan.oleary@findest.eu&tenant=Ro3Test"
            className="w-full h-full border-none"
            title="Advanced Search"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearchModal;
