/**
 * Global Search Bar Component
 *
 * A simplified search input component that handles user input and emits search events.
 *
 * @component
 * @example
 * <SearchBar
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   onSearch={handleSearch}
 *   isLoading={isLoading}
 * />
 */
import { Loader, Search, X } from "lucide-react";

import { useTranslation } from "react-i18next";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ value, onChange, onSearch, isLoading }: SearchBarProps) => {
  const { t } = useTranslation();

  const handleReset = () => {
    onChange("");
    onSearch("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    onSearch(newValue);
  };

  return (
    <div className="search">
      <form className="w-full" onSubmit={(e) => e.preventDefault()}>
        <div>
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={handleChange}
              className="flex w-full rounded-full border border-slate-200 py-2 pl-10 text-black"
              placeholder={t("searchPlaceholder")}
              aria-label="Search input"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500">
              <Search size={20} />
            </div>
            {value && (
              <button
                type="button"
                onClick={handleReset}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 transform items-center text-gray-500 focus:outline-none"
                aria-label="Clear search"
              >
                {isLoading && <Loader size={20} className="mr-2 animate-spin" />}
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
