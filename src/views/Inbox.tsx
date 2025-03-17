import ItemCard from "@/components/common/cards/item-card";
import DocumentsSkeleton from "@/components/common/loaders/documents-skeleton";
import { CardContent } from "@/components/ui/card";

import { useState } from "react";

import { useGetMyDocumentInboxQuery } from "../api/documents/documentApi";

export const Inbox = () => {
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [documentsPerPage, setDocumentsPerPage] = useState(12);
  const [filters, setFilters] = useState<string[]>([]);

  const { data, isLoading, isError, error, refetch } = useGetMyDocumentInboxQuery(
    { page: currentPage, limit: documentsPerPage, filters },
    { refetchOnMountOrArgChange: true },
  );

  const handleSelectDoc = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedDocs);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedDocs(newSelected);
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
              <ItemCard
                key={doc.id}
                {...doc}
                itemType="study"
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
