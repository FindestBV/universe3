import { useGetLinkingQuery, useGetPageTypesQuery } from "@/api/activity/activityApi";
import DataViewPanel from "@/components/shared/layout/data-view-panel";
import DataViewSearchBar from "@/components/shared/search/data-view-searchbar";
import { FindestButton } from "@/components/shared/utilities/findest-button";
import { useDebounce } from "@/hooks/use-debounce";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";

import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export const DataView = () => {
  const [filters, setFilters] = useState<string[]>([]);
  const filterOptions = ["Link", "Pack"];
  const defaultView = "Link";
  const navigate = useNavigate();

  const { data: linkingData } = useGetLinkingQuery();
  const { data: typesData } = useGetPageTypesQuery();
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const debouncedTriggerSearch = useDebounce(() => {
    if (filters.keyword.trim()) {
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value.trim()) queryParams.append(key, value);
      });

      const queryString = queryParams.toString();

      searchItems(queryString)
        .unwrap()
        .then((response) => {
          console.log("Search response:", response);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });

      setHasSearched(true);
      setIsTyping(false); // Stop typing indicator after the search is triggered
    }
  }, 500);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setSearchKeyword((prev) => ({
        ...prev,
        [name]: value,
      }));
      setIsTyping(true); // User is actively typing
      debouncedTriggerSearch();
    },
    [debouncedTriggerSearch],
  );

  const handleAddFilter = (filterType: string) => {
    if (!filters.includes(filterType)) {
      setFilters([...filters, filterType]);
    }
  };

  const handleRemoveFilter = (filter: string) => {
    setFilters(filters.filter((f: string) => f !== filter));
  };

  return (
    <motion.div
      className="dataView"
      initial={{ opacity: 0 }} // Slide in from the right
      animate={{ opacity: 1 }} // Animate to final position
      exit={{ opacity: 0 }} // Slide out to the right
      transition={{
        duration: 0.35, // Duration in seconds
        ease: "easeInOut", // Smoother easing
      }}
    >
      <div className="toolbar absolute top-0 w-full bg-white px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left Section: Ask Igor Button */}
          <div className="flex flex-nowrap items-center space-x-2">
            <FindestButton
              align="left"
              extraClassName={"rounded border-0"}
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
            <DataViewSearchBar onChange={handleInputChange} />

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

      <div className="text-center">
        <div className="absolute left-5 top-[5em] p-4">
          <ul className="flex flex-col">
            <li className="flex flex-row items-center gap-2 text-sm text-gray-500">
              <span className="blueDot__indicator"></span>Entity
            </li>
            <li className="flex flex-row items-center gap-2 text-sm text-gray-500">
              <span className="purpleDot__indicator"></span>Study
            </li>
          </ul>
        </div>
        {defaultView == "Link" ? (
          <DataViewPanel linkingData={linkingData} />
        ) : (
          <DataViewPanel data={typesData} searchKeyword={searchKeyword} />
        )}
      </div>
    </motion.div>
  );
};

export default DataView;
