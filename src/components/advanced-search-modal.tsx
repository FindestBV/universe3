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
          <button className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm font-bold">
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
