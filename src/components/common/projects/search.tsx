/**
 * Project Search component provides an overview of project Pages with tab navigation.
 * This is Relevant for Universe Projects/Pages
 *
 * @component
 * @example
 *
 * @returns {JSX.Element} A project overview component with dynamic tab functionality.
 */
import { useSearchItemsMutation } from "@/api/search/searchApi";
import AskIgorModal from "@/components/common/dialogs/ask-igor";
import SearchBar from "@/components/common/search/searchbar";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLast, ChevronLeft, ChevronRight, Plus, SearchIcon } from "lucide-react";

import { useCallback, useState } from "react";

/**
 * PresetButton component renders a button with a title and description.
 *
 * @component
 * @param {Object} props - The properties of the PresetButton component.
 * @param {string} [props.title] - The title of the button.
 * @param {string} [props.description] - The description displayed under the title.
 * @param {string} props.className - Additional CSS classes for styling.
 * @returns {JSX.Element} A styled button component.
 */

function PresetButton({
  title,
  description,
}: {
  title?: string;
  description?: string;
  className: string;
}) {
  return (
    <Button
      variant="ghost"
      className="group h-auto w-full justify-between bg-slate-100 p-2 hover:bg-slate-400"
    >
      <div className="flex items-start gap-4">
        <div className="text-left">
          <h3 className="font-medium group-hover:text-white">{title}</h3>
          <p className="text-sm text-gray-600 group-hover:text-white">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
}

const TABS = ["All", "Entity", "Document", "Query", "Study"];

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

export const ProjectSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchItems, { data: searchData, isLoading }] = useSearchItemsMutation();

  const debouncedSearch = useDebounce((query: string) => {
    if (query.trim()) {
      const queryParams = new URLSearchParams();
      queryParams.append("keyword", query);
      searchItems(queryParams.toString());
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
  }, 500);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      debouncedSearch(query);
    },
    [debouncedSearch],
  );

  const filterResults = (data: SearchData | undefined): SearchResult[] => {
    if (!data) return [];

    const allResults = Object.keys(data)
      .filter((key) => Array.isArray(data[key]) && data[key].length > 0)
      .flatMap((key) =>
        data[key].map((item) => ({
          id: item?.id || "",
          name: item?.name || "Unnamed",
          type: [
            "ScienceArticle",
            "Weblink",
            "Technology",
            "Technology Scouting",
            "UsPatent",
          ].includes(item?.type || "")
            ? "Document"
            : item?.type || "Unknown",
          url: item?.url || `/projects/${key}/${item?.id}`,
          description: item?.description,
        })),
      )
      .filter((item) => item.id && item.name);

    if (selectedTab === "All") {
      return allResults;
    }

    return allResults.filter((item) => item.type === selectedTab);
  };

  const filteredResults = filterResults(searchData);

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
      <div className="grid grid-cols-1 gap-4">
        {filteredResults.map((result) => (
          <div
            key={result.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="text-sm text-gray-500">{result.type}</div>
            <h3 className="mb-2 text-lg font-semibold">
              <a
                href={result.url}
                className="text-black hover:text-blue-800 hover:underline"
                target={result.url.startsWith("http") ? "_blank" : "_self"}
                rel={result.url.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {result.name}
              </a>
            </h3>
            {result.description && (
              <p className="line-clamp-2 text-sm text-gray-600">{result.description}</p>
            )}
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
          <div className="mb-4 flex items-center gap-4">
            <SearchIcon className="h-6 w-6" />
            <h1 className="mb-2 text-2xl font-bold">Search in this project</h1>
          </div>
          <div className="mb-4">
            <div className="mx-auto max-w-[1024px]">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                isLoading={isLoading}
              />
              <div className="mx-auto mt-4 flex w-full items-center justify-center gap-2 py-2">
                <button
                  type="submit"
                  className="rounded-md bg-black p-2 px-4 text-sm text-white hover:bg-slate-500 focus:outline-none"
                >
                  Search this project
                </button>
                <AskIgorModal label="Chat about this project" />
              </div>
            </div>
          </div>
          <div className="mt-16">
            {filteredResults && filteredResults.length > 0 ? (
              <div className="mb-4 flex items-center gap-2">
                <ArrowLeft />
                <h3 className="font-black">Results for: {searchQuery}</h3>
              </div>
            ) : null}
            <Tabs defaultValue="All" className="pb-4" onValueChange={setSelectedTab}>
              <TabsList className="flex w-full items-center justify-between border-b border-slate-300 bg-transparent">
                <div className="flex gap-2">
                  {TABS.map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className={`flex p-2 text-sm transition-all duration-150 ${
                        selectedTab === tab
                          ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                          : "text-black"
                      }`}
                    >
                      {tab}
                      {tab === selectedTab && filteredResults.length > 0 && (
                        <div className="-mt-2 ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-300 text-xs font-black text-blue-600">
                          {filteredResults.length}
                        </div>
                      )}
                    </TabsTrigger>
                  ))}
                </div>
              </TabsList>
              <TabsContent value={selectedTab} className="mt-6">
                {renderSearchResults()}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectSearch;
