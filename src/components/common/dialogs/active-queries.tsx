import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { RootState } from "@/store";
import { CheckCircle, Link, Save, Search, Trash2 } from "lucide-react";
import { Loader, Pin, SquareArrowOutUpRight, TriangleAlert } from "lucide-react";

import { useSelector } from "react-redux";

import { AddLinkToItem } from "./add-link-to-item";

export const ActiveQueries: React.FC = () => {
  const activeQueries = useSelector((state: RootState) => state.document.activeQueries || []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative border-none bg-[#006A86] text-white">
          {activeQueries.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
              {activeQueries.length}
            </span>
          )}
          <Search className="h-4 w-4 text-white" />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-black">Queries</SheetTitle>
        </SheetHeader>

        <ScrollArea className="mt-4 h-[calc(100vh-100px)]">
          <h3 className="text-md pb-2 font-bold">Active:</h3>

          <div className="space-y-4">
            <div className="flex w-full">
              <div className="w-full rounded-lg border border-neutral-200 bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium">Term</h3>
                  <span className="text-sm text-muted-foreground">11:17</span>
                </div>
                {/* <p className="text-sm text-muted-foreground">
                Status: Complete <CheckCircle size={18} />
              </p> */}
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm">Status:</span>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
                    Pending...
                  </span>
                </div>
              </div>
              <div className="links mx-2 flex w-auto flex-col gap-2">
                <a href="#" className="linkQuery items-center rounded bg-[#006A86] p-2 text-white">
                  <Link size={14} />
                </a>
                <a href="#" className="trashCan items-center rounded p-2 text-white">
                  <Trash2 size={14} />
                </a>
              </div>
            </div>

            <h3 className="text-md pb-2 font-bold">Complete:</h3>

            <div className="flex w-full">
              <div className="w-full rounded-lg border border-neutral-200 bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium">Term</h3>
                  <span className="text-sm text-muted-foreground">11:17</span>
                </div>
                {/* <p className="text-sm text-muted-foreground">
                Status: Complete <CheckCircle size={18} />
              </p> */}
                <div className="mt-2 flex space-x-2">
                  <div className="flex justify-between text-sm text-green-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="text-sm">
                    Query completed in <strong>01:33</strong>
                  </p>
                </div>
              </div>
              <div className="links mx-2 flex w-auto flex-col gap-1">
                <a href="#" className="linkQuery items-center rounded bg-[#006A86] p-2 text-white">
                  <Link size={14} />
                </a>
                <a href="#" className="trashCan items-center rounded p-2 text-white">
                  <Trash2 size={14} />
                </a>
                <a href="#" className="items-center rounded bg-yellow-500 p-2 text-white">
                  <Save size={14} />
                </a>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ActiveQueries;
