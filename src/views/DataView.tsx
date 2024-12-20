import { useGetLinkingQuery, useGetPageTypesQuery } from "@/api/activity/activityApi";
import ForceDirectedGraphView from "@/components/shared/layout/force-directed-graph";
import PackGraphView from "@/components/shared/layout/pack-graph";
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
  const [searchKeyword, setSearchKeyword] = useState<string>(""); // Initialize as string
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
  const { data: linkingData } = useGetLinkingQuery();
  const { data: typesData } = useGetPageTypesQuery();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value || ""); // Ensure a string
  };

  const handleOptionSelect = (label: string) => {
    const graphType = viewOptions[label];
    setSelectedView(graphType); // Update view
    setSearchKeyword(""); // Reset search input
    setSearchResults([]); // Clear results
  };

  useEffect(() => {
    const currentKeyword =
      typeof debouncedSearchKeyword === "string" ? debouncedSearchKeyword.trim() : ""; // Safeguard
    const dataToFilter = selectedView === "link" ? linkingData : typesData;

    if (currentKeyword) {
      const filteredResults = dataToFilter?.filter((item) =>
        item.name.toLowerCase().includes(currentKeyword.toLowerCase()),
      );
      setSearchResults(filteredResults || []);
    } else {
      setSearchResults(dataToFilter || []);
    }
  }, [debouncedSearchKeyword, selectedView, linkingData, typesData]);

  return (
    <motion.div
      className="dataView"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="toolbar absolute top-0 w-full bg-white px-4 py-2">
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
                <button className="group flex items-center px-4 py-2 text-gray-800">
                  {optionLabels.find((label) => viewOptions[label] === selectedView)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="relative z-50 w-full bg-white shadow-lg">
                <DropdownMenuGroup>
                  {optionLabels.map((label) => (
                    <DropdownMenuItem
                      key={label}
                      onClick={() => handleOptionSelect(label)}
                      className={`px-4 py-2 ${
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
          <DataViewSearchBar onChange={handleInputChange} />
        </div>
      </div>

      <div className="mt-4 text-center">
        {selectedView === "link" ? (
          <ForceDirectedGraphView linkingData={searchResults} />
        ) : (
          <PackGraphView data={searchResults} />
        )}
      </div>
    </motion.div>
  );
};

export default DataView;
