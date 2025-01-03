import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Bot } from "lucide-react";

const AskIgorModal: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <button className="flex items-center gap-1 rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-200">
            <Bot className="h-4" />
            Ask IGOR<sup>AI</sup>
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="h-[80vh] max-w-6xl bg-slate-100">
        <div className="flex h-full w-full items-start">ASK IGOR MODAL CONTENT HERE</div>
      </DialogContent>
    </Dialog>
  );
};

export default AskIgorModal;
