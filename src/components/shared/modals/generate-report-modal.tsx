import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardPlus } from "lucide-react";

import { useTranslation } from "react-i18next";

import DocumentSkeleton from "../loaders/document-skeleton";

type ModalProps = {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  onClose: () => void;
};

const GenerateReport: React.FC<ModalProps> = ({ leftContent, rightContent, onClose }) => {
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <button className="peer/menu-button flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm font-bold outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0">
            <ClipboardPlus className="h-4" />
            <span>{t("generateReport")}</span>
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="flex h-[80vh] max-w-6xl flex-col items-start bg-slate-100 p-6">
        <div className="header">
          <h2 className="pl-2 text-2xl font-black">{t("generateReport")}</h2>
        </div>
        <div className="flex h-full w-full flex-1 flex-col md:flex-row">
          {/* Left Column */}
          <div className="w-1/4 overflow-y-auto border-r border-gray-200 p-4">
            {leftContent}
            <Skeleton className="mb-2 h-10 w-full animate-pulse bg-gray-400" />
            <Skeleton className="mb-2 h-10 w-full animate-pulse bg-gray-300" />
            <Skeleton className="mb-2 h-10 w-full animate-pulse bg-gray-400" />
            <Skeleton className="mb-2 h-10 w-full animate-pulse bg-gray-300" />
          </div>

          {/* Right Column */}
          <div className="w-3/4 overflow-y-auto p-4">
            {rightContent}
            <Skeleton className="mb-2 h-10 w-3/4 animate-pulse bg-gray-400" />
            <Skeleton className="mb-2 h-10 w-full animate-pulse bg-gray-300" />
            <Skeleton className="mb-2 h-20 w-full animate-pulse bg-gray-300" />
            <Skeleton className="mb-2 h-10 w-3/4 animate-pulse bg-gray-400" />
            <Skeleton className="mb-2 h-10 w-full animate-pulse bg-gray-300" />
            <Skeleton className="mb-2 h-20 w-full animate-pulse bg-gray-300" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateReport;
