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
import { FilterIcon, ListFilter } from "lucide-react";

import { FilterOptions } from "../layout/filter-options";

export const FilterSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="flex items-center rounded-md p-2 text-gray-600 hover:bg-black hover:text-white"
          id="addNewTabButton"
        >
          <ListFilter />
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-black">
            <FilterIcon fill="#000" /> Filter options
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-4">
          <FilterOptions />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
