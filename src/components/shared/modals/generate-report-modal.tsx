import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ClipboardPlus } from "lucide-react";

const GenerateReport: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <button className="peer/menu-button flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm font-bold outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0">
            <ClipboardPlus className="h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="h-[80vh] max-w-6xl bg-slate-100">
        <p>Report generation Modal</p>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateReport;
