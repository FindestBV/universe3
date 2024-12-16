import React, { useState } from 'react';
import { useGetStudiesQuery } from '../services/study/studyApi'; // Update the query hook to fetch studies
import { CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { StudyCard } from '@/components/study-card'; // Use StudyCard instead of DocumentCard
import { ListPagination } from '@/components/list-pagination';
import DocumentSkeleton from '@/components/document-skeleton'; // Use a skeleton loader specific to studies

export const Studies: React.FC = () => {
  const [selectedStudies, setSelectedStudies] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [studiesPerPage, setStudiesPerPage] = useState(12);
  const [tempLoading, setTempLoading] = useState(false); // Temporary loading state
  const [filters, setFilters] = useState<string[]>([]); // State for filters

  const { data, isLoading, isError, error, refetch } = useGetStudiesQuery(
    { page: currentPage, limit: studiesPerPage },
    { refetchOnMountOrArgChange: true }
  );

  const totalPages = data ? Math.ceil(data.totalCount / studiesPerPage) : 1;

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleSelectAll = (checked: boolean) => {
    if (checked && data) {
      setSelectedStudies(new Set(data.studies.map((study) => study.id)));
    } else {
      setSelectedStudies(new Set());
    }
  };

  const handleSelectStudy = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedStudies);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedStudies(newSelected);
  };

  const handleStudiesPerPageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setStudiesPerPage(value);
    setCurrentPage(1); // Reset to first page

    setTempLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setTempLoading(false);
    refetch();
  };

  const handleAddFilter = () => {
    const newFilter = `Filter ${filters.length + 1}`;
    setFilters([...filters, newFilter]);
  };

  const handleRemoveFilter = (filter: string) => {
    setFilters(filters.filter((f) => f !== filter));
  };

  return (
    <div className="flex flex-col w-full h-full max-sm:px-4 px-12">
      <div className="flex items-center justify-between gap-4 rounded-lg mb-2">
        <div>
          <Checkbox
            id="select-all"
            checked={data ? selectedStudies.size === data.studies.length : false}
            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
            className="ml-4"
          />
        </div>

        <div className="flex items-center gap-4 flex-grow mr-4">
          {/* Render filters dynamically */}
          {filters.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {filters.map((filter) => (
                <div
                  key={filter}
                  onClick={() => handleRemoveFilter(filter)}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-800 hover:bg-red-100 hover:text-red-800 cursor-pointer transition"
                >
                  {filter} ×
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            id="add-filter"
            onClick={handleAddFilter}
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group mt-2 mb-2 border shadow-sm text-gray-800 transition-all duration-150 ${
              filters.length > 0 ? 'bg-blue-50 font-black' : 'bg-gray hover:bg-blue-50 hover:font-black'
            }`}
          >
            Add Filters
          </button>

          <div className="w-full sm:w-1/2 md:w-1/4 flex flex-col items-end">
            <select
              id="studiesPerPage"
              value={studiesPerPage}
              onChange={handleStudiesPerPageChange}
              className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={25}>25</option>
              <option value={20}>20</option>
              <option value={15}>15</option>
              <option value={10}>10</option>
              <option value={5}>5</option>
            </select>
          </div>
        </div>
      </div>

      {tempLoading && <p>LOADING</p>}
      <CardContent className="p-0">
        {isError && <div className="text-red-600">Error loading studies: {JSON.stringify(error)}</div>}
        {isLoading && <DocumentSkeleton />}
        {data && (
          <div>
            {data.studies.slice(0, studiesPerPage).map((study) => (
              <StudyCard
                key={study.id}
                {...study}
                isSelected={selectedStudies.has(study.id)}
                onSelect={handleSelectStudy}
              />
            ))}
            <ListPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
            />
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default Studies;
