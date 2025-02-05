import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CheckCircle, Link, Loader2, Save, Search, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";

export const ActiveQueries: React.FC = () => {
  const [activeQueries, setActiveQueries] = useState([
    { id: 1, term: "Always Pending", status: "pending" },
    { id: 2, term: "Temporary Pending", status: "pending" },
  ]);

  const [completedQueries, setCompletedQueries] = useState<any[]>([]);

  // Complete the second query after 6.5 seconds
  useEffect(() => {
    const secondQueryTimer = setTimeout(() => {
      setActiveQueries((prev) => prev.filter((query) => query.id !== 2));
      setCompletedQueries((prev) => [
        ...prev,
        { id: 2, term: "Temporary Pending", status: "complete", time: "01:33" },
      ]);
    }, 6500);

    return () => clearTimeout(secondQueryTimer);
  }, []);

  // Complete the first query 8 seconds after the second query (total 14.5s)
  useEffect(() => {
    const firstQueryTimer = setTimeout(() => {
      setActiveQueries((prev) => prev.filter((query) => query.id !== 1));
      setCompletedQueries((prev) => [
        ...prev,
        { id: 1, term: "Always Pending", status: "complete", time: "02:10" },
      ]);
    }, 14500); // 14.5s in total

    return () => clearTimeout(firstQueryTimer);
  }, []);

  return (
    <Sheet className="w-full">
      <SheetTrigger asChild>
        <Button variant="outline" className="relative border-none bg-[#006A86] text-white">
          <span
            className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full ${activeQueries && activeQueries.length > 0 ? "bg-yellow-500" : "bg-green-500"} text-xs text-white`}
          >
            2
          </span>

          <Search className="h-4 w-4 text-white" />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-black">Queries</SheetTitle>
        </SheetHeader>

        <ScrollArea className="mt-4 h-[calc(100vh-100px)]">
          {activeQueries.length > 0 && <h3 className="text-md pb-2 font-bold">Active:</h3>}

          <div className="space-y-4">
            {activeQueries.map((query) => (
              <div key={query.id} className="flex w-full">
                <div className="w-full rounded-lg border border-neutral-200 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium">{query.term}</h3>
                    <span className="text-sm text-muted-foreground">11:17</span>
                  </div>

                  <div className="mt-2 flex items-center space-x-2">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
                      Pending...
                    </span>
                  </div>
                </div>
                <div className="links mx-2 flex w-auto flex-col gap-2">
                  <a
                    href="#"
                    className="linkQuery items-center rounded bg-[#006A86] p-2 text-white"
                  >
                    <Link size={14} />
                  </a>
                  <a href="#" className="trashCan items-center rounded p-2 text-white">
                    <Trash2 size={14} />
                  </a>
                </div>
              </div>
            ))}

            <h3 className="text-md pb-2 font-bold">Complete:</h3>

            {completedQueries.map((query) => (
              <div key={query.id} className="flex w-full">
                <div className="w-full rounded-lg border border-neutral-200 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium">{query.term}</h3>
                    <span className="text-sm text-muted-foreground">11:17</span>
                  </div>

                  <div className="mt-2 flex space-x-2">
                    <div className="flex justify-between text-sm text-green-600">
                      <CheckCircle size={18} />
                    </div>
                    <p className="text-sm">
                      Query completed in <strong>{query.time}</strong>
                    </p>
                  </div>
                </div>
                <div className="links mx-2 flex w-auto flex-col gap-1">
                  <a
                    href="#"
                    className="linkQuery items-center rounded bg-[#006A86] p-2 text-white"
                  >
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
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ActiveQueries;
