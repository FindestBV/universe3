/**
 * Project Search component provides a simple search interface for projects
 *
 * @component
 * @returns {JSX.Element} A project search component
 */
import { useAdvancedSearchQuery } from "@/api/search/searchApi";
import AskIgorModal from "@/components/common/dialogs/ask-igor";
import SearchBar from "@/components/common/search/searchbar";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import useNavigateWithTransition from "@/hooks/use-navigate-with-transition";
import { clearSearchHistory, getRecentSearchQueries, saveSearchQuery } from "@/utils/indexedDB";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, SearchIcon, Telescope, Trash2 } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

interface SearchResult {
  id: string;
  name: string;
  type: string;
  url: string;
  description?: string;
}

interface SearchData {
  [key: string]: Array<{
    id?: string;
    name?: string;
    type?: string;
    url?: string;
    description?: string;
  }>;
}

export const ProjectFinder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [recentQueries, setRecentQueries] = useState<
    Array<{ id: string; query: string; timestamp: number }>
  >([]);
  const { data: searchData, isLoading } = useAdvancedSearchQuery(
    searchQuery.trim() ? searchQuery : "default",
    { skip: !searchQuery.trim() },
  );
  const navigateWithTransition = useNavigateWithTransition();

  useEffect(() => {
    loadRecentQueries();
  }, []);

  const loadRecentQueries = async () => {
    try {
      const queries = await getRecentSearchQueries();
      setRecentQueries(queries);
    } catch (error) {
      console.error("Error loading recent queries:", error);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearSearchHistory();
      setRecentQueries([]);
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  };

  const debouncedSearch = useDebounce((query: string) => {
    if (query.trim()) {
      setSearchQuery(query);
      setHasSearched(true);
      saveSearchQuery(query).catch(console.error);
    } else {
      setSearchQuery("");
      setHasSearched(false);
    }
  }, 500);

  const handleSearch = useCallback(
    (query: string) => {
      debouncedSearch(query);
    },
    [debouncedSearch],
  );

  const filterResults = (data: SearchData | undefined): SearchResult[] => {
    if (!data) return [];

    return Object.keys(data)
      .filter((key) => Array.isArray(data[key]) && data[key].length > 0)
      .flatMap((key) =>
        data[key].map((item) => ({
          id: item?.id || "",
          name: item?.name || "Unnamed",
          type: item?.type || "Unknown",
          url: item?.url || `/projects/${key}/${item?.id}`,
          description: item?.description,
        })),
      )
      .filter((item) => item.id && item.name);
  };

  const filteredResults = filterResults(searchData);

  const renderRecentQueries = () => {
    if (!hasSearched && recentQueries.length > 0) {
      return (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <h3 className="font-medium">Recent Queries</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              className="text-gray-500 hover:text-gray-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {recentQueries.map((query) => (
              <button
                key={query.id}
                onClick={() => handleSearch(query.query)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50"
              >
                <SearchIcon className="h-4 w-4 text-gray-500" />
                <span>{query.query}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderSearchResults = () => {
    if (!hasSearched) {
      return null;
    }

    if (isLoading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <div className="text-gray-500">Searching...</div>
        </div>
      );
    }

    if (filteredResults.length === 0) {
      return (
        <div className="flex h-64 items-center justify-center">
          <div className="text-gray-500">No results found</div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-2">
        {filteredResults.map((result) => (
          <div key={result.id} className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
            <h3 className="font-medium">{result.name}</h3>
            <p className="text-sm text-gray-600">{result.description}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="min-h-full" id="projects-search">
        <div className="mx-auto max-w-full p-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <SearchIcon className="h-6 w-6" />
              <h1 className="mb-2 text-2xl font-bold">Advanced Search [TEST!!! DO NOT USE]</h1>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <h5>Need to find new sources?</h5>
              <button
                className="flex items-center gap-2 rounded border border-slate-300 bg-slate-100 px-4 py-2 text-black transition-colors duration-200 hover:bg-slate-200"
                onClick={() => navigateWithTransition("/projects/dashboard")}
              >
                <Telescope /> Find external papers
              </button>
            </div>
          </div>
          <div className="mb-4">
            <div className="mx-auto max-w-[1024px]">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                isLoading={isLoading}
              />
            </div>
          </div>
          <div className="mt-8">
            {filteredResults && filteredResults.length > 0 && (
              <div className="mb-4 flex items-center gap-2">
                <ArrowLeft />
                <h3 className="font-black">Results for: {searchQuery}</h3>
              </div>
            )}
            {renderSearchResults()}
            {renderRecentQueries()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectFinder;
