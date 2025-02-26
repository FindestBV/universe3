import { useGetSavedDocumentsQuery } from "@/api/documents/documentApi";
import { ItemCard } from "@/components/common/cards/item-card";
import DocumentsSkeleton from "@/components/common/loaders/documents-skeleton";
import { CardContent } from "@/components/ui/card";

import { useEffect, useState } from "react";

export const Sources: React.FC = () => {
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [documentsPerPage, setDocumentsPerPage] = useState(12);
  const [tempLoading, setTempLoading] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { data, isLoading, isError, error, refetch } = useGetSavedDocumentsQuery(
    { page: currentPage, limit: documentsPerPage },
    { refetchOnMountOrArgChange: true },
  );

  const totalPages = data ? Math.ceil(data.totalCount / documentsPerPage) : 1;

  // const handlePageChange = (page: number) => setCurrentPage(page);
  // const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  // const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // const handleSelectAll = (checked: boolean) => {
  //   setIsChecked(!isChecked);
  //   if (checked && data) {
  //     setSelectedDocs(new Set(data.documents.map((doc) => doc.id)));
  //   } else {
  //     setSelectedDocs(new Set());
  //   }
  // };

  // const bulkSelectAction = () => {
  //   console.log(`collective action on ${selectedDocs}`, selectedDocs);
  // };

  // const bulkDeSelectAction = () => {
  //   setSelectedDocs(new Set());
  // };

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

  const filterOptions = ["SCIENCE", "PATENT", "WEBPAGE"];

  const handleAddFilter = (filterType: string) => {
    if (!filters.includes(filterType)) {
      setFilters([...filters, filterType]);
    }
  };

  const handleRemoveFilter = (filter: string) => {
    setFilters(filters.filter((f) => f !== filter));
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, [data]);

  return (
    <div className="flex h-full w-full flex-col px-12 max-sm:px-4">
      <div className="mb-2 flex items-center justify-between gap-1 rounded-lg">
        <div className="flex items-center gap-2">
          <h1 className="pt-2 text-xl font-bold">Sources</h1>
        </div>
      </div>

      <CardContent className="p-0">
        {isError && (
          <div className="text-red-600">Error loading documents: {JSON.stringify(error)}</div>
        )}
        {isLoading && <DocumentsSkeleton />}
        {data && (
          <div>
            {data.documents.slice(0, documentsPerPage).map((doc) => (
              <ItemCard
                itemType="source"
                key={doc.id}
                {...doc}
                isSelected={selectedDocs.has(doc.id)}
                onSelect={handleSelectDoc}
              />
            ))}
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default Sources;
