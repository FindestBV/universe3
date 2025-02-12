/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchItemsMutation } from "@/api/search/searchApi";
import { useDebounce } from "@/hooks/use-debounce";
import { useTruncateText } from "@/hooks/use-truncate-text";
import { Loader, Search, X } from "lucide-react";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

const TABS = ["All", "Entity", "Document", "Query", "Study"];

export const SearchBar = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    keyword: "",
    type: "",
    category: "",
    tags: "",
    authors: "",
    sources: "",
  });

  const [selectedTab, setSelectedTab] = useState(TABS[0]); // Default to "All"
  const [hasSearched, setHasSearched] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [searchItems, { data, isLoading }] = useSearchItemsMutation();

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
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
      setIsTyping(true); // User is actively typing
      debouncedTriggerSearch();
    },
    [debouncedTriggerSearch],
  );

  const handleInputPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = e.clipboardData.getData("text");
      setFilters((prev) => ({
        ...prev,
        keyword: pastedText,
      }));
      setIsTyping(true);
      debouncedTriggerSearch();
    },
    [debouncedTriggerSearch],
  );

  const handleInputBlur = () => {
    if (!filters.keyword.trim()) {
      handleReset();
    }
  };

  const handleReset = () => {
    setFilters({
      keyword: "",
      type: "",
      category: "",
      tags: "",
      authors: "",
      sources: "",
    });
    setSelectedTab("All");
    searchItems("");
    setHasSearched(false);
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
          url: item?.url || `/projects/${key}/${item?.id}`,
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

  const filteredResults = filterResults(data);
  return (
    <div className="">
      {/* Search Input */}
      <form className="w-full">
        <div>
          <div className="relative">
            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleInputChange}
              onPaste={handleInputPaste}
              onBlur={handleInputBlur}
              className="flex w-full rounded-full bg-gradient-to-r from-[#F9FAF9] via-[#CBD5E1] via-40% to-[#E2E8F0] py-2 pl-10 text-black"
              placeholder={t("searchPlaceholder")}
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

      {/* Filter Tabs and Results */}
      {(filteredResults.length > 0 || hasSearched) && (
        <div className="left-0 z-50 mt-2 w-full rounded-md border border-gray-300 bg-white px-2 py-4 shadow-lg">
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 border-b border-gray-300 bg-white pb-4 max-sm:w-full max-sm:flex-col">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`max-w-full flex-1 rounded-lg px-4 py-2 text-center text-sm ${
                  selectedTab === tab ? "bg-blue-300 text-white" : "bg-gray-200"
                } duration-200 hover:bg-gray-400 hover:text-gray-50`}
                aria-pressed={selectedTab === tab}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="overflow-y-scroll" style={{ maxHeight: "350px" }}>
            {filteredResults.length > 0 ? (
              <ul aria-live="polite" aria-busy={isLoading}>
                {filteredResults.map((entity) => (
                  <li
                    key={entity.id}
                    className="flex items-center justify-between gap-2 border-b p-2 last:border-b-0 hover:bg-gray-100"
                  >
                    <div>
                      <span className="block text-sm text-gray-400">{entity.type}</span>
                      <a
                        href={entity.url}
                        target={entity.url.startsWith("http") ? "_blank" : "_self"}
                        rel={entity.url.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="font-semibold text-black hover:text-gray-500 hover:underline"
                      >
                        {entity.name.length > 140 ? entity.name.slice(0, 137) + "..." : entity.name}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              filteredResults.length === 0 &&
              hasSearched &&
              !isLoading && <p className="p-4 text-sm text-gray-500">No items found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
