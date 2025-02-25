import ItemCard from "@/components/common/cards/item-card";
import DocumentsSkeleton from "@/components/common/loaders/documents-skeleton";
import { CardContent } from "@/components/ui/card";

import { useState } from "react";

import { useGetEntitiesQuery } from "../api/documents/documentApi";

export const Pages: React.FC = () => {
  const [selectedEntities, setSelectedEntities] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [entitiesPerPage, setEntitiesPerPage] = useState(12);
  // const [_tempLoading, setTempLoading] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  // const [isChecked, setIsChecked] = useState<boolean>(false);

  const { data, isLoading, isError, error, refetch } = useGetEntitiesQuery(
    { page: currentPage, limit: entitiesPerPage },
    { refetchOnMountOrArgChange: true },
  );

  const handleSelectDoc = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedEntities);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedEntities(newSelected);
  };

  const handleRemoveFilter = (filter: string) => {
    setFilters(filters.filter((f) => f !== filter));
  };

  return (
    <div className="flex h-full w-full flex-col px-12 max-sm:px-4">
      <div className="mb-2 flex items-center justify-between gap-1 rounded-lg">
        <div className="flex items-center gap-2">
          <h1 className="pt-2 text-xl font-bold">Pages</h1>
        </div>

        <div className="mr-4 flex flex-grow items-center gap-4">
          {filters.length > 0 && (
            <div className="ml-auto flex flex-wrap gap-2">
              {filters.map((filter) => (
                <div
                  key={filter}
                  onClick={() => handleRemoveFilter(filter)}
                  className="cursor-pointer rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 transition hover:bg-red-100 hover:text-red-800"
                >
                  {filter} ×
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-0">
        {isError && (
          <div className="text-red-600">Error loading documents: {JSON.stringify(error)}</div>
        )}
        {isLoading && <DocumentsSkeleton />}
        {data && (
          <div>
            {data?.entities
              .slice(0, entitiesPerPage)
              .map((ent) => (
                <ItemCard
                  itemType="entity"
                  key={ent.id}
                  {...ent}
                  isSelected={selectedEntities.has(ent.id)}
                  onSelect={handleSelectDoc}
                />
              ))}
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default Pages;
