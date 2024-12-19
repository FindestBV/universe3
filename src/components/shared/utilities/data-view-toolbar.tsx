import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

import { FC, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../search/searchbar";
import { FindestButton } from "./findest-button";

interface DataViewToolbarProps {
  children: ReactNode;
}

export const DataViewToolbar: FC<DataViewToolbarProps> = () => {
  const [filters, setFilters] = useState<string[]>([]);
  const filterOptions = ["RELATIONS GRAPH", "PAGE TYPE BREAKDOWN"];
  const navigate = useNavigate();

  const handleAddFilter = (filterType: string) => {
    if (!filters.includes(filterType)) {
      setFilters([...filters, filterType]);
    }
  };

  const handleRemoveFilter = (filter: string) => {
    setFilters(filters.filter((f: string) => f !== filter));
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="toolbar absolute top-0 w-full border-b border-gray-300 bg-gray-100 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left Section: Ask Igor Button */}
        <div className="flex flex-nowrap items-center space-x-2">
          <FindestButton
            align="left"
            extraClassName={
              "rounded bg-white px-8 py-2 text-white transition hover:bg-blue-700 hover:text-white"
            }
            onClick={() => navigate("/dashboard")}
          >
            BACK TO OVERVIEW
          </FindestButton>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                id="add-filter"
                className={`group mb-2 mt-2 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-gray-800 shadow-sm transition-all duration-150 ${
                  filters.length > 0
                    ? "bg-blue-50 font-black"
                    : "bg-gray hover:bg-blue-50 hover:font-black"
                }`}
              >
                RELATIONS GRAPH
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="relative z-50 w-full bg-white shadow-lg">
              <DropdownMenuGroup>
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => !filters.includes(option) && handleAddFilter(option)}
                    className={`w-full px-8 py-2 ${
                      filters.includes(option)
                        ? "cursor-not-allowed bg-gray-200 text-gray-400"
                        : "cursor-pointer hover:bg-gray-100"
                    }`}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Section: Formatting and Alignment Options */}
        <div className="flex items-center space-x-2">
          {/* Bold Button */}
          <SearchBar />

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  id="add-filter"
                  className={`group mb-2 mt-2 flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-gray-800 shadow-sm transition-all duration-150 ${
                    filters.length > 0
                      ? "bg-blue-50 font-black"
                      : "bg-gray hover:bg-blue-50 hover:font-black"
                  }`}
                >
                  Filters
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="relative z-50 w-full bg-white shadow-lg">
                <DropdownMenuGroup>
                  {filterOptions.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => !filters.includes(option) && handleAddFilter(option)}
                      className={`w-full px-8 py-2 ${
                        filters.includes(option)
                          ? "cursor-not-allowed bg-gray-200 text-gray-400"
                          : "cursor-pointer hover:bg-gray-100"
                      }`}
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataViewToolbar;
