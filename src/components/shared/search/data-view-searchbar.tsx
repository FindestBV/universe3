/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetLinkingDataByTitleQuery } from "@/api/activity/activityApi";
import { useDebounce } from "@/hooks/use-debounce";
import { Loader, Search, X } from "lucide-react";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

const TABS = ["All", "Entity", "Document", "Query", "Study"];

export const DataViewSearchBar = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    keyword: "",
    type: "",
  });

  const [selectedTab, setSelectedTab] = useState(TABS[0]); // Default to "All"
  const [isTyping, setIsTyping] = useState(false);

  const debouncedKeyword = useDebounce(filters.keyword || "", 500);

  // Ensure debouncedKeyword is a string before calling .trim()
  const trimmedKeyword = typeof debouncedKeyword === "string" ? debouncedKeyword.trim() : "";

  const { data, isLoading, error } = useGetLinkingDataByTitleQuery(trimmedKeyword, {
    skip: !trimmedKeyword, // Skip query if trimmedKeyword is empty
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    console.log("value", value);
    setFilters((prev) => ({ ...prev, keyword: value }));
    setIsTyping(true); // User is actively typing
  }, []);

  const handleInputPaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    setFilters((prev) => ({ ...prev, keyword: pastedText }));
    setIsTyping(true);
  }, []);

  const handleInputBlur = () => {
    if (!filters.keyword.trim()) {
      handleReset();
    }
  };

  const handleReset = () => {
    setFilters({
      keyword: "",
      type: "",
    });
    setSelectedTab("All");
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const filterResults = (data: any) => {
    if (!data) return [];

    const allResults = Object.keys(data)
      .filter((key) => Array.isArray(data[key]) && data[key].length > 0)
      .flatMap((key) =>
        data[key].map((item: any) => ({
          id: item?.id,
          name: item?.name || "Unnamed",
          type: [
            "ScienceArticle",
            "Weblink",
            "Technology",
            "Technology Scouting",
            "UsPatent",
          ].includes(item?.type)
            ? "Document"
            : item?.type || "Unknown",
          url: item?.url || `/library/${key}/${item?.id}`,
        })),
      )
      .filter((item) => item.id && item.name);

    const groupedResults = allResults.reduce((groups: Record<string, any[]>, item) => {
      if (!groups[item.type]) {
        groups[item.type] = [];
      }
      groups[item.type].push(item);
      return groups;
    }, {});

    if (selectedTab === "All") {
      return allResults;
    }

    return groupedResults[selectedTab] || [];
  };

  const results = filterResults(data);

  return (
    <div className="dataViewSearchBar">
      {/* Search Input */}
      <form className="space-y-4">
        <div>
          <div className="relative">
            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleInputChange}
              onPaste={handleInputPaste}
              onBlur={handleInputBlur}
              className="w-full rounded-sm border border-gray-300 py-2 pl-10 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("dataViewSearchPlaceholder")}
              aria-label="Search input"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500">
              <Search size={20} />
            </div>
            {filters.keyword && (
              <button
                type="button"
                onClick={handleReset}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 transform items-center text-gray-500 focus:outline-none"
                aria-label="Clear search"
              >
                {isTyping || isLoading ? <Loader size={20} className="mr-2 animate-spin" /> : null}
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Render Results */}
      <div className="results">{trimmedKeyword && trimmedKeyword}</div>
    </div>
  );
};

export default DataViewSearchBar;
