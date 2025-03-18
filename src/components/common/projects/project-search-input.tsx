import { useDebounce } from "@/hooks/use-debounce";
import { Loader, Search, X } from "lucide-react";

import { useEffect } from "react";

interface ProjectSearchInputProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export const ProjectSearchInput = ({
  onSearch,
  isLoading,
  value,
  onChange,
}: ProjectSearchInputProps) => {
  const debouncedSearch = useDebounce((query: string) => {
    onSearch(query);
  }, 500);

  useEffect(() => {
    debouncedSearch(value);
  }, [value, debouncedSearch]);

  const handleReset = () => {
    onChange("");
    onSearch("");
  };

  return (
    <div className="search">
      <div className="w-full">
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex w-full rounded-full border border-slate-200 py-2 pl-10 text-black"
            placeholder="Search projects..."
            aria-label="Search projects"
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
              {isLoading ? <Loader size={20} className="mr-2 animate-spin" /> : null}
              <X size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSearchInput;
