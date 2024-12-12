/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { List, MoreHorizontal, Network, ScanEye, Search, SquareArrowOutUpRight, X, Loader } from 'lucide-react';
import { useSearchItemsMutation } from '../services/search/search';
import { useDebounce } from '../hooks/use-debounce';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from './ui/button';

const TABS = ['All', 'Entity', 'Document', 'Query', 'Study'];

export const SearchBar = () => {
  const [filters, setFilters] = useState({
    keyword: '',
    type: '',
    category: '',
    tags: '',
    authors: '',
    sources: '',
  });

  const [selectedTab, setSelectedTab] = useState(TABS[0]); // Default to "All"
  const [hasSearched, setHasSearched] = useState(false);

  const [searchItems, { data, isLoading }] = useSearchItemsMutation();

  const debouncedTriggerSearch = useDebounce(() => {
    if (filters.keyword.trim()) {
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value.trim()) queryParams.append(key, value);
      });

      const queryString = queryParams.toString();
      // console.log('Triggering search with query:', queryString);

      searchItems(queryString)
        .unwrap()
        .then((response) => {
          console.log('Search response:', response);
        })
        .catch((error) => {
          console.error('Error fetching search results:', error);
        });

      setHasSearched(true);
    }
  }, 500);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
      debouncedTriggerSearch();
    },
    [debouncedTriggerSearch]
  );

  const handleInputPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = e.clipboardData.getData('text');
      setFilters((prev) => ({
        ...prev,
        keyword: pastedText,
      }));
      debouncedTriggerSearch();
    },
    [debouncedTriggerSearch]
  );

  const handleInputBlur = () => {
    if (!filters.keyword.trim()) {
      handleReset();
    }
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      type: '',
      category: '',
      tags: '',
      authors: '',
      sources: '',
    });
    setSelectedTab('All');
    searchItems('');
    setHasSearched(false);
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const filterResults = (data: any) => {
    if (!data) return [];

    // console.log('Raw API Response:', data);

    const allResults = Object.keys(data)
      .filter((key) => Array.isArray(data[key]) && data[key].length > 0)
      .flatMap((key) =>
        data[key].map((item: any) => ({
          id: item?.id,
          name: item?.name || 'Unnamed',
          type: ['ScienceArticle', 'Weblink', 'Technology', 'Technology Scouting', 'UsPatent'].includes(item?.type)
            ? 'Document'
            : item?.type || 'Unknown',
          url: item?.url || `/library/${key}/${item?.id}`,
        }))
      )
      .filter((item) => item.id && item.name);

    return selectedTab === 'All'
      ? allResults
      : allResults.filter((item) => item.type === selectedTab);
  };

  const filteredResults = filterResults(data);

  return (
    <div className="relative max-sm:w-full w-1/2 mx-auto">
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
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search the Universe"
              aria-label="Search input"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Search size={20} />
            </div>
            {filters.keyword && (
              <button
                type="button"
                onClick={handleReset}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Filter Tabs and Results as Absolute */}
      {(filteredResults.length > 0 || hasSearched) && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg z-20 mt-2 border border-gray-300 rounded-md py-4 px-2">
          {/* Filter Tabs */}
          <div className="flex max-sm:flex-col max-sm:w-full flex-wrap justify-center gap-4 pb-4 bg-white border-b border-gray-300">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 max-w-full px-4 py-2 rounded-lg text-center ${
                  selectedTab === tab ? 'bg-black text-white' : 'bg-gray-200'
                } hover:bg-gray-400 hover:text-gray-50 duration-200`}
                aria-pressed={selectedTab === tab}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="flex justify-center items-center py-4">
              <Loader className="animate-spin text-blue-500" size={32} />
            </div>
          )}

          {/* Results or No Results */}
          <div className="overflow-y-scroll" style={{ maxHeight: '350px' }}>
            {filteredResults.length > 0 ? (
              <ul aria-live="polite" aria-busy={isLoading}>
                {filteredResults.map((entity) => (
                  <li
                    key={entity.id}
                    className="p-2 border-b last:border-b-0 hover:bg-gray-100 flex items-center gap-2 justify-between"
                  >
                    <div>
                      <span className="block text-sm text-gray-600 font-bold">{entity.type}</span>
                      <a
                        href={entity.url}
                        target={entity.url.startsWith('http') ? '_blank' : '_self'}
                        rel={entity.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-blue-500 hover:underline"
                      >
                        {entity.name}
                      </a>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="rotated" className="h-10 w-10 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <SquareArrowOutUpRight /><a href={entity.url}
                        target={entity.url.startsWith('http') ? '_blank' : '_self'}
                        rel={entity.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-blue-500 hover:underline"> Open Page</a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ScanEye /> Open Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Network /> Open in Tree View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <List /> Open in List View
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                ))}
              </ul>
            ) : (
              filteredResults.length === 0 && hasSearched && !isLoading && (
                <p className="p-4 text-sm text-gray-500">No items found.</p>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
