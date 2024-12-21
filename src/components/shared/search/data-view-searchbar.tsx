import { useGetLinkingDataByTitleQuery } from "@/api/activity/activityApi";
import { useDebounceDataView } from "@/hooks/use-debounce-data-view";
import { Loader, Search, X } from "lucide-react";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export const DataViewSearchBar = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ keyword: "" });
  const [isTyping, setIsTyping] = useState(false);

  // Debounce the search keyword
  const debouncedKeyword = useDebounceDataView(filters.keyword || "", 500);

  // Ensure debouncedKeyword is a string before calling .trim()
  const trimmedKeyword = typeof debouncedKeyword === "string" ? debouncedKeyword.trim() : "";

  // Log the search input and debounced keyword for debugging
  console.log("Search Input (filters.keyword):", filters.keyword);
  console.log("Debounced Keyword:", debouncedKeyword);
  console.log("Trimmed Keyword:", trimmedKeyword);

  // Query the API with the trimmed keyword
  const { data, isLoading, error } = useGetLinkingDataByTitleQuery(trimmedKeyword, {
    skip: !trimmedKeyword, // Skip query if trimmedKeyword is empty
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilters((prev) => ({ ...prev, keyword: value }));
    setIsTyping(true);
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
    setFilters({ keyword: "" });
  };

  return (
    <div className="dataViewSearchBar">
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

      {/* Debugging Output */}
      {/* <div className="results">
        <p>Search Input: {filters.keyword}</p>
        <p>Debounced Keyword: {debouncedKeyword}</p>
        <p>Trimmed Keyword: {trimmedKeyword}</p>
      </div> */}

      {/* API Results */}
      {/* <div className="results">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data?.length > 0 ? (
          data.map((result: any) => (
            <div key={result.id}>
              <a href={result.url}>{result.name}</a>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div> */}
    </div>
  );
};

export default DataViewSearchBar;
