/**
 * AdvancedSearchModal Component
 *
 * This component triggers an **Advanced Search Dialog**, which integrates an external
 * search interface via an embedded **iframe**. It is used for performing complex
 * queries and retrieving detailed search results.
 *
 * **Work in Progress (WIP)**: This component is subject to further enhancements
 * and refinements.
 *
 * Features:
 * - **Modal-based search interface** powered by ShadCN’s `Dialog`.
 * - **Trigger button with an icon** to open the search dialog.
 * - **Embedded iframe** displaying an external search tool.
 * - **Customizable URL parameters** for user-specific search environments.
 *
 * @component
 * @example
 * <AdvancedSearchModal />
 *
 * @dependencies
 * - **ShadCN UI Components**: Dialog, DialogTrigger, DialogContent
 * - **Lucide Icons**: Search
 *
 * @returns {JSX.Element} The rendered AdvancedSearchModal component.
 */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Search } from "lucide-react";

const AdvancedSearchModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <Button className="peer/menu-button flex h-full w-full items-center gap-2 overflow-hidden rounded-md bg-slate-200 p-2.5 text-sm transition-[width,height,padding] hover:bg-black hover:text-white">
            <Search size={24} className="h-4 w-4" />
          </Button>
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

export default AdvancedSearchModal;
