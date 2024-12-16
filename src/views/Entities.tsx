import DocumentsSkeleton from "@/components/documents-skeleton";
import { EntityCard } from "@/components/entity-card";
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

import React, { useState } from "react";

import { useGetEntitiesQuery } from "../services/entities/entityApi";

export const Entities: React.FC = () => {
  const [selectedEntities, setSelectedEntities] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [entitiesPerPage, setEntitiesPerPage] = useState(12);
  const [tempLoading, setTempLoading] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { data, isLoading, isError, error, refetch } = useGetEntitiesQuery(
    { page: currentPage, limit: entitiesPerPage },
    { refetchOnMountOrArgChange: true },
  );

  const totalPages = data ? Math.ceil(data.totalCount / entitiesPerPage) : 1;

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleSelectAll = (checked: boolean) => {
    setIsChecked(!isChecked);
    if (checked && data) {
      setSelectedEntities(new Set(data.entities.map((ent) => ent.id)));
    } else {
      setSelectedEntities(new Set());
    }
  };

  const handleSelectDoc = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedEntities);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedEntities(newSelected);
  };

  const handleEntitiesPerPageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setEntitiesPerPage(value);
    setCurrentPage(1);

    setTempLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setTempLoading(false);
    refetch();
  };

  const handleAddFilter = (filterType: string) => {
    if (!filters.includes(filterType)) {
      setFilters([...filters, filterType]);
    }
  };

  const handleRemoveFilter = (filter: string) => {
    setFilters(filters.filter((f) => f !== filter));
  };

  const filterOptions = ["SCIENCE", "PATENT", "WEBPAGE"];

  return (
    <div className="flex h-full w-full flex-col px-12 max-sm:px-4">
      <div className="mb-2 flex items-center justify-between gap-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={
              data && data.entities.length > 0
                ? selectedEntities.size === data.entities.length
                : false
            }
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

        {/* <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={data ? selectedDocs.size === data.documents.length : false}
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
        </div> */}

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

        <div className="">
          <select
            id="studiesPerPage"
            value={entitiesPerPage}
            onChange={handleEntitiesPerPageChange}
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

      {tempLoading && <p>LOADING</p>}
      <CardContent className="p-0">
        {isError && (
          <div className="text-red-600">Error loading documents: {JSON.stringify(error)}</div>
        )}
        {isLoading && <DocumentsSkeleton />}
        {data && (
          <div>
            {data.entities.slice(0, entitiesPerPage).map((ent) => (
              <EntityCard
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

export default Entities;
