import ItemCard from "@/components/common/cards/item-card";
import { DocumentsSkeleton } from "@/components/common/loaders/documents-skeleton";
import { CardContent } from "@/components/ui/card";

import { useEffect, useState } from "react";

import { useGetStudiesQuery } from "../api/documents/documentApi";

export const Studies: React.FC = () => {
  const [selectedStudies, setSelectedStudies] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [studiesPerPage, setStudiesPerPage] = useState(12);

  const { data, isLoading, isError, error, refetch } = useGetStudiesQuery(
    { page: currentPage, limit: studiesPerPage },
    { refetchOnMountOrArgChange: true },
  );

  const handleSelectStudy = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedStudies);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedStudies(newSelected);
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="flex h-full w-full flex-col px-12 max-sm:px-4">
      <div className="mb-2 flex items-center justify-between gap-1 rounded-lg">
        <div className="flex items-center gap-2">
          <h1 className="pt-2 text-xl font-bold">Studies</h1>
        </div>
      </div>

      <CardContent className="p-0">
        {isError && (
          <div className="text-red-600">Error loading studies: {JSON.stringify(error)}</div>
        )}
        {isLoading && <DocumentsSkeleton />}
        {data && (
          <div>
            {data.studies.slice(0, studiesPerPage).map((study) => (
              <ItemCard
                id={study.id}
                itemType="study"
                key={study.id}
                {...study}
                isSelected={selectedStudies.has(study.id)}
                onSelect={handleSelectStudy}
              />
            ))}
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default Studies;
