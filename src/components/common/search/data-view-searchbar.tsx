import { useDebounceDataView } from "@/hooks/use-debounce-data-view";
import { Loader, Search, X } from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type DataViewSearchBarProps = {
  onSearch: (searchKeyword: string) => void; // Prop to pass search keyword to parent
};

export const DataViewSearchBar: React.FC<DataViewSearchBarProps> = ({ onSearch }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ keyword: "" });
  const [isTyping, setIsTyping] = useState(false);
  const [searchInput, setSearchInput] = useState(""); // Local state for search input
  const debouncedKeyword = useDebounceDataView(searchInput, 500); // Debounced version of input

  useEffect(() => {
    // Pass the debounced keyword to the parent
    onSearch(debouncedKeyword.trim());
  }, [debouncedKeyword, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value); // Update local state
  };

  const handleInputPaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    setFilters((prev) => ({ ...prev, keyword: pastedText }));
    setIsTyping(true);
  }, []);

  const handleReset = () => {
    setFilters({ keyword: "" });
    onSearch(""); // Notify parent of reset
  };

  return (
    <div className="dataViewSearchBar">
      <form className="space-y-4">
        <div>
          <div className="relative">
            <input
              type="text"
              name="keyword"
              value={searchInput}
              onChange={handleInputChange}
              onPaste={handleInputPaste}
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
                {isTyping ? <Loader size={20} className="mr-2 animate-spin" /> : null}
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default DataViewSearchBar;
