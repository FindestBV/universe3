import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Bot } from "lucide-react";

const AskIgorModal: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <button className="flex w-full items-center gap-1 overflow-hidden rounded-md p-2 text-left text-sm font-bold outline ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0">
            <Bot className="h-4" />
            Ask IGOR<sup>AI</sup>
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="h-[80vh] max-w-6xl bg-slate-100">
        <div className="flex h-full w-full items-start">
          <iframe
            src="https://use-ui.findest.com/?email=ronan.oleary@findest.eu&tenant=Ro3Test"
            className="h-full w-full border-none"
            title="Advanced Search"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AskIgorModal;
