import { useGetLinkingQuery, useGetPageTypesQuery } from "@/api/activity/activityApi";
import ForceDirectedGraphView from "@/components/shared/layout/force-directed-graph";
import PackGraphView from "@/components/shared/layout/pack-graph";
import DataViewSearchBar from "@/components/shared/search/data-view-searchbar";
import { FindestButton } from "@/components/shared/utilities/findest-button";
import { useDebounceDataView } from "@/hooks/use-debounce-data-view";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";

import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const DataView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const viewOptions = {
    "RELATIONS GRAPH": "link",
    "PAGE TYPE BREAKDOWN": "pack",
  };

  const optionLabels = Object.keys(viewOptions);
  const initialGraphType = location.state?.graphType?.toLowerCase() || "link";

  const [selectedView, setSelectedView] = useState<string>(initialGraphType);
  const [searchKeyword, setSearchKeyword] = useState<string>(""); // Controlled state for search
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // Debounce the search keyword
  const debouncedSearchKeyword = useDebounceDataView(searchKeyword, 500);
  const trimmedKeyword =
    typeof debouncedSearchKeyword === "string" ? debouncedSearchKeyword.trim() : "";

  // Fetch data from APIs
  const {
    data: linkingData,
    isLoading: linkingLoading,
    error: linkingError,
  } = useGetLinkingQuery();
  const { data: typesData, isLoading: typesLoading, error: typesError } = useGetPageTypesQuery();

  // Handle filtering based on search and view
  const handleSearch = useCallback(
    (keyword: string) => {
      console.log("Search Keyword:", keyword); // Debugging: Log keyword
      const dataToFilter = selectedView === "link" ? linkingData : typesData;
      console.log("dataToFilter:", dataToFilter); // Debugging: Log keyword
      if (!dataToFilter) return; // No data to filter

      // Filter data based on the search keyword
      const lowerKeyword = keyword.toLowerCase();

      const filtered = dataToFilter.reduce((acc: any[], node: any) => {
        const newChildren = (node.children || []).filter((child: any) =>
          child.name?.toLowerCase().includes(lowerKeyword),
        );
        if (newChildren.length > 0) {
          acc.push({ ...node, children: newChildren });
        }
        return acc;
      }, []);
      console.log("filtered:", filtered);
      setFilteredData(filtered); // Update filtered results
    },
    [selectedView, linkingData, typesData],
  );

  // Watch for changes to debounced search keyword and trigger filtering
  useEffect(() => {
    console.log("filtered:", filteredData); // Debugging: Log keyword
    handleSearch(trimmedKeyword);
  }, [trimmedKeyword, handleSearch]);

  return (
    <motion.div
      className="dataView"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="toolbar absolute top-0 z-10 w-full bg-white px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FindestButton
              align="left"
              extraClassName="rounded border-0"
              onClick={() => navigate("/dashboard")}
            >
              BACK TO OVERVIEW
            </FindestButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center bg-gray-100 px-4 py-2 text-gray-800">
                  {optionLabels.find((label) => viewOptions[label] === selectedView)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="relative z-50 w-full bg-white shadow-lg">
                <DropdownMenuGroup>
                  {optionLabels.map((label) => (
                    <DropdownMenuItem
                      key={label}
                      onClick={() => setSelectedView(viewOptions[label])}
                      className={`cursor-pointer px-4 py-2 ${
                        viewOptions[label] === selectedView ? "font-bold" : ""
                      }`}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search Bar with Controlled Input */}
          <DataViewSearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className="flex items-center justify-center">
        {selectedView === "link" ? (
          <ForceDirectedGraphView
            linkingData={filteredData && filteredData.length ? filteredData : linkingData}
            searchKeyword={searchKeyword}
          />
        ) : (
          <PackGraphView data={filteredData} />
        )}
      </div>
    </motion.div>
  );
};

export default DataView;
