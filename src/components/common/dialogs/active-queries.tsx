import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Loader, Pin, Search, SquareArrowOutUpRight, TriangleAlert } from "lucide-react";

import { Spinner } from "../editor/ui/Spinner";

interface ActiveQueriesProps {
  activeQueries?: [];
}

export const ActiveQueries: React.FC = ({ activeQueries }: ActiveQueriesProps) => {
  console.log("activeQueries", activeQueries);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">
          {activeQueries && activeQueries.documents.length > 0 ? (
            <span className="indicator">{activeQueries ? activeQueries.documents.length : 1}</span>
          ) : null}

          <Button variant="outline" className="border-none bg-[#006A86] text-white">
            <Search width={20} className="text-white" />
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-black">Active Queries</SheetTitle>
          <SheetDescription>
            You currently have {activeQueries?.documents.length ?? 0} active queries
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-2 py-4">
          {activeQueries?.documents.map((d) => {
            return (
              <div key={d.id} className="activeQueries">
                <div className="flex items-center gap-2">
                  <SquareArrowOutUpRight size={20} className="hover:text-[#006A86]" />
                  <Pin size={18} className="hover:text-[#006A86]" />
                  <p className="text-sm font-bold">{d.title}</p>
                </div>

                <TriangleAlert size={18} />
                <Loader className="h-5 w-5 animate-spin" />
              </div>
            );
          })}
        </div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ActiveQueries;
