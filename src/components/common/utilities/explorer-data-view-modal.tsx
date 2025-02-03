import { useGetLinkingQuery, useGetPageTypesQuery } from "@/api/activity/activityApi";
import ForceDirectedGraphView from "@/components/common/layout/force-directed-graph";
import PackGraphView from "@/components/common/layout/pack-graph";
import DataViewSearchBar from "@/components/common/search/data-view-searchbar";
import { useDebounce } from "@/hooks/use-debounce";
import { motion } from "framer-motion";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const ExplorerDataViewModal = () => {
  const viewOptions = {
    "RELATIONS GRAPH": "link",
    "PAGE TYPE BREAKDOWN": "pack",
  };

  const optionLabels = Object.keys(viewOptions);
  const [selectedView, setSelectedView] = useState<string>("link");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [filteredResults, setFilteredResults] = useState<any[]>([]);

  // Ensure debouncedSearchKeyword is always a string
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500) || "";

  const { data: linkingData } = useGetLinkingQuery();
  const { data: typesData } = useGetPageTypesQuery();

  const currentData = useMemo(() => {
    return selectedView === "link" ? linkingData : typesData;
  }, [selectedView, linkingData, typesData]);

  const previousResultsRef = useRef<any[]>([]);

  // Filter the data when the debounced search keyword changes
  useEffect(() => {
    if (!currentData) {
      setFilteredResults([]);
      return;
    }

    if (!debouncedSearchKeyword) {
      // Reset to the full dataset if the search keyword is empty
      setFilteredResults(currentData);
      previousResultsRef.current = currentData;
      return;
    }

    const lowerKeyword =
      typeof debouncedSearchKeyword === "string" ? debouncedSearchKeyword.toLowerCase() : "";

    const results = currentData.reduce((acc: any[], node: any) => {
      const childrenKey = selectedView === "link" ? "lowerLevelNodes" : "children";

      const matchingChildren = (node[childrenKey] || []).filter((child: any) =>
        child.name?.toLowerCase().includes(lowerKeyword),
      );

      if (node.name?.toLowerCase().includes(lowerKeyword) || matchingChildren.length > 0) {
        acc.push({ ...node, [childrenKey]: matchingChildren });
      }

      return acc;
    }, []);

    // Only update if the results actually change
    if (JSON.stringify(results) !== JSON.stringify(previousResultsRef.current)) {
      setFilteredResults(results);
      previousResultsRef.current = results;
    }
  }, [debouncedSearchKeyword, currentData, selectedView]);

  const handleSearchChange = useCallback((keyword: string) => {
    setSearchKeyword(keyword || ""); // Ensure keyword is always a string
  }, []);

  const handleOptionSelect = useCallback((label: string) => {
    setSelectedView(viewOptions[label]);
    setSearchKeyword(""); // Clear search on view change
    setFilteredResults([]); // Reset filtered results
  }, []);

  return (
    <div className="d-view-modal flex flex-col">
      <motion.div
        className="expModal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        {/* Toolbar with Tabs */}
        <div className="toolbar w-full bg-white px-4 py-2">
          <div className="flex items-center justify-between">
            {/* View Selection Tabs */}
            <div className="flex space-x-4">
              {optionLabels.map((label) => (
                <button
                  key={label}
                  onClick={() => handleOptionSelect(label)}
                  className={`rounded px-4 py-2 ${
                    viewOptions[label] === selectedView
                      ? "bg-[#006A86] text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <DataViewSearchBar onSearch={handleSearchChange} />
          </div>
        </div>

        {/* Graph View */}
        <div className="mt-4 flex items-center justify-center">
          {selectedView === "link" ? (
            <ForceDirectedGraphView linkingData={filteredResults} />
          ) : (
            <PackGraphView data={filteredResults} />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ExplorerDataViewModal;
