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

import { useEffect, useState } from "react";
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
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Debounce the search keyword
  const debouncedSearchKeyword = useDebounceDataView(searchKeyword, 500);
  const trimmedKeyword =
    typeof debouncedSearchKeyword === "string" ? debouncedSearchKeyword.trim() : "";

  console.log("Search Keyword:", searchKeyword);
  console.log("Debounced Search Keyword:", debouncedSearchKeyword);
  console.log("Trimmed Keyword:", trimmedKeyword);

  // Fetch data from APIs
  const {
    data: linkingData,
    isLoading: linkingLoading,
    error: linkingError,
  } = useGetLinkingQuery();
  const { data: typesData, isLoading: typesLoading, error: typesError } = useGetPageTypesQuery();

  console.log("Linking Data:", linkingData);
  console.log("Types Data:", typesData);
  console.log("Errors:", { linkingError, typesError });

  // Handle filtering based on search and view
  useEffect(() => {
    console.log("Selected View for Filtering:", selectedView);

    const dataToFilter = selectedView === "link" ? linkingData : typesData;

    console.log("Raw Data to Filter:", dataToFilter);

    if (trimmedKeyword) {
      const filteredResults = dataToFilter?.filter((item) =>
        item.name.toLowerCase().includes(trimmedKeyword.toLowerCase()),
      );
      console.log("Filtered Results:", filteredResults);
      setSearchResults(filteredResults || []);
    } else {
      console.log("No keyword; using full data.");
      setSearchResults(dataToFilter || []);
    }
  }, [trimmedKeyword, selectedView, linkingData, typesData]);

  useEffect(() => {
    console.log("DataView mounted");
  }, []);

  console.log("Search Results in DataView:", searchResults);

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

          {/* Updated Search Bar: Pass handler for searchKeyword */}
          <DataViewSearchBar onSearchChange={(keyword: string) => setSearchKeyword(keyword)} />
        </div>
      </div>

      <div className="flex items-center justify-center">
        {selectedView === "link" ? (
          <>
            <ForceDirectedGraphView linkingData={linkingData} searchResults={searchResults} />
          </>
        ) : (
          <>
            <PackGraphView data={typesData} />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default DataView;
