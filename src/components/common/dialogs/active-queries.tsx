import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { RootState } from "@/store";
import { CheckCircle, Search } from "lucide-react";
import { Loader, Pin, SquareArrowOutUpRight, TriangleAlert } from "lucide-react";

import { useSelector } from "react-redux";

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
          <Search className="mr-2 h-4 w-4 text-white" />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-black">Queries</SheetTitle>
        </SheetHeader>

        <ScrollArea className="mt-4 h-[calc(100vh-100px)]">
          <h3 className="text-md pb-2 font-bold">Active:</h3>

          <div className="space-y-4">
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">Term</h3>
                <span className="text-sm text-muted-foreground">11:17</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Status: Complete <CheckCircle size={18} />
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm">Status:</span>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
                  Pending...
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">Term</h3>
                <span className="text-sm text-muted-foreground">11:09</span>
              </div>
              <p className="text-sm text-muted-foreground">Category: Patents</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm">Status:</span>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
                  Pending...
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">Term</h3>
                <span className="text-sm text-muted-foreground">11:07</span>
              </div>
              <p className="text-sm text-muted-foreground">Category: Patents</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm">Status:</span>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
                  Pending...
                </span>
              </div>
            </div>

            <h3 className="text-md pb-2 font-bold">Complete:</h3>
            <div className="rounded-lg border border-green-400 bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">TITLE</h3>
                <span className="text-sm text-muted-foreground">11:12</span>
              </div>
              <p className="flex justify-between text-sm text-muted-foreground">
                <span>Complete</span> <CheckCircle size={18} />
              </p>
              <div className="mt-2 bg-white">
                <h4 className="mb-1 text-sm font-medium">Results:</h4>
                <p className="text-sm">
                  Query executed in <strong>15</strong> seconds
                </p>
                <pre className="rounded p-2 text-xs">View Results</pre>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ActiveQueries;
