import { InboxCard } from "@/components/common/cards/inbox-card";
import DocumentsSkeleton from "@/components/common/loaders/documents-skeleton";
import { CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
// Import your Pagination buttons (assumed to render just the chevron icons)
import { PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Link, Trash2 } from "lucide-react";

import { useState } from "react";

import { useGetMyDocumentInboxQuery } from "../api/documents/documentApi";

export const Inbox: React.FC = () => {
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [documentsPerPage, setDocumentsPerPage] = useState(12);
  const [tempLoading, setTempLoading] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { data, isLoading, isError, error, refetch } = useGetMyDocumentInboxQuery(
    { page: currentPage, limit: documentsPerPage, filters },
    { refetchOnMountOrArgChange: true },
  );

  const totalPages = data ? Math.ceil(data.totalCount / documentsPerPage) : 1;

  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleSelectAll = (checked: boolean) => {
    setIsChecked(!isChecked);
    if (checked && data) {
      setSelectedDocs(new Set(data.documents.map((doc) => doc.id)));
    } else {
      setSelectedDocs(new Set());
    }
  };

  const handleSelectDoc = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedDocs);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedDocs(newSelected);
  };

  const handleDocumentsPerPageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setDocumentsPerPage(value);
    setCurrentPage(1);
    setTempLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setTempLoading(false);
    refetch();
  };

  const filterOptions = ["SCIENCE", "PATENT", "WEBPAGE", "NOT LINKED"];

  const handleAddFilter = (filterType: string) => {
    if (!filters.includes(filterType)) {
      setFilters([...filters, filterType]);
    }
  };

  const handleRemoveFilter = (filter: string) => {
    setFilters(filters.filter((f) => f !== filter));
  };

  // Calculate the range of documents being shown.
  const startRange = data ? (currentPage - 1) * documentsPerPage + 1 : 0;
  const endRange = data ? Math.min(currentPage * documentsPerPage, data.totalCount) : 0;

  return (
    <div className="flex h-full w-full flex-col px-12 max-sm:px-4">
      {/* Top Row: Filter Controls and Pagination */}
      <div className="mb-4 flex items-center justify-between gap-4 rounded-lg">
        {/* Left side: Checkbox, Filters, and Studies-Per-Page select */}
        <div className="flex items-center gap-4">
          <Checkbox
            id="select-all"
            checked={data ? selectedDocs.size === data.documents.length : false}
            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
          />
          {isChecked && (
            <div className="flex gap-2">
              <a href="#" className="linkedStudy">
                <Link size={18} />
              </a>
              <a href="#" className="trashCan">
                <Trash2 size={18} />
              </a>
            </div>
          )}
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <div
                  key={filter}
                  onClick={() => handleRemoveFilter(filter)}
                  className="cursor-pointer rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 transition"
                >
                  {filter} ×
                </div>
              ))}
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                id="add-filter"
                className="group flex items-center gap-2 rounded-md border px-2 py-1 text-gray-800 shadow-sm transition-all duration-150 hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`lucide lucide-filter ${filters.length > 0 ? "fill-black" : "group-hover:fill-black"}`}
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Add Filters
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="relative z-50 w-full bg-white shadow-lg">
              <DropdownMenuGroup>
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => !filters.includes(option) && handleAddFilter(option)}
                    className={`w-full px-8 py-1 ${
                      filters.includes(option)
                        ? "cursor-not-allowed bg-gray-200 text-gray-400"
                        : "cursor-pointer hover:bg-gray-100"
                    }`}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <select
            id="studiesPerPage"
            value={documentsPerPage}
            onChange={handleDocumentsPerPageChange}
            className="rounded-md border py-1.5 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value={25}>25</option>
            <option value={20}>20</option>
            <option value={15}>15</option>
            <option value={10}>10</option>
            <option value={5}>5</option>
          </select>
        </div>

        {/* Right side: Pagination */}
        {data && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {startRange}-{endRange} of {data.totalCount}
            </span>
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              <PaginationPrevious />
            </button>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              <PaginationNext />
            </button>
          </div>
        )}
      </div>

      {/* Document List */}
      <CardContent className="p-0">
        {isError && (
          <div className="text-red-600">Error loading documents: {JSON.stringify(error)}</div>
        )}
        {isLoading && <DocumentsSkeleton />}
        {data && (
          <div>
            {data.documents.slice(0, documentsPerPage).map((doc) => (
              <InboxCard
                key={doc.id}
                {...doc}
                isSelected={selectedDocs.has(doc.id)}
                onSelect={handleSelectDoc}
                images={doc.images}
              />
            ))}
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default Inbox;
