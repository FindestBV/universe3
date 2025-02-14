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
  return (
    <div className="flex h-full w-full flex-col px-12 max-sm:px-4">
      <div className="mb-2 flex items-center justify-between gap-1 rounded-lg">
        <div className="flex items-center gap-2">
          <h1 className="pt-2 text-xl font-bold">Inbox</h1>
        </div>
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
