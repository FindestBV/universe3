import DocumentSkeleton from "@/components/loaders/document-skeleton";
import { StudyCard } from "@/components/shared/study-card";
import { CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Link, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";

import { useGetStudiesQuery } from "../services/study/studyApi";

export const Studies: React.FC = () => {
  const [selectedStudies, setSelectedStudies] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [studiesPerPage, setStudiesPerPage] = useState(12);
  const [filters, setFilters] = useState<string[]>([]); // State for filters
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { data, isLoading, isError, error, refetch } = useGetStudiesQuery(
    { page: currentPage, limit: studiesPerPage },
    { refetchOnMountOrArgChange: true },
  );

  const totalPages = data ? Math.ceil(data.totalCount / studiesPerPage) : 1;

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleSelectAll = (checked: boolean) => {
    setIsChecked(!isChecked);
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
    await new Promise((resolve) => setTimeout(resolve, 500));
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
  }, []);

  return (
    <div className="flex h-full w-full flex-col px-12 max-sm:px-4">
      <div className="mb-2 flex items-center justify-between gap-1 rounded-lg">
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={data ? selectedStudies.size === data.studies.length : false}
            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
            className="ml-4"
          />
          {isChecked && (
            <div className="ml-4 flex gap-2">
              <a href="#" className="linkedStudy">
                <Link size={18} />
              </a>
              <a href="#" className="trashCan">
                <Trash2 size={18} />
              </a>
            </div>
          )}
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

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                id="add-filter"
                className={`group mb-2 mt-2 flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-gray-800 shadow-sm transition-all duration-150 ${
                  filters.length > 0
                    ? "bg-blue-50 font-black"
                    : "bg-gray hover:bg-blue-50 hover:font-black"
                }`}
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
                    onClick={() => !filters.includes(option) && handleAddFilter(option)} // Prevent onClick if already selected
                    className={`w-full px-8 py-2 ${
                      filters.includes(option)
                        ? "cursor-not-allowed bg-gray-200 text-gray-400" // Greyed out style for selected items
                        : "cursor-pointer hover:bg-gray-100" // Default style for unselected items
                    }`}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mr-[1.5em]">
          <select
            id="studiesPerPage"
            value={studiesPerPage}
            onChange={handleStudiesPerPageChange}
            className="rounded-md border p-2 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value={25}>25</option>
            <option value={20}>20</option>
            <option value={15}>15</option>
            <option value={10}>10</option>
            <option value={5}>5</option>
          </select>
        </div>
      </div>

      <CardContent className="p-0">
        {isError && (
          <div className="text-red-600">Error loading studies: {JSON.stringify(error)}</div>
        )}
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
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default Studies;
