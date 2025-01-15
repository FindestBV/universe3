import { useAdvancedSearchQuery } from "@/api/search/searchApi";
import GenericCard from "@/components/shared/cards/generic-card";
import CreateQueryDialog from "@/components/shared/dialogs/create-query-dialog";
import DocumentSkeleton from "@/components/shared/loaders/document-skeleton";
import { DocumentsSkeleton } from "@/components/shared/loaders/documents-skeleton";
// import { StudyCard } from "@/components/shared/study-card";
import { CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";

import { useGetStudiesQuery } from "../api/documents/documentApi";

export const AdvancedSearch: React.FC = () => {
  const [selectedSearchItems, setSelectedSearchItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  //   const [filters, setFilters] = useState<string[]>([]); // State for filters
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { data, isLoading, isError, error, refetch } = useGetStudiesQuery(
    { page: currentPage, limit: itemsPerPage },
    { refetchOnMountOrArgChange: true },
  );

  const { data: advancedSearchData, isLoading: advancedSearchDataIsLoading } =
    useAdvancedSearchQuery();

  // const totalPages = data ? Math.ceil(data.totalCount / studiesPerPage) : 1;
  console.log("advanced search data", advancedSearchData);
  // const handlePageChange = (page: number) => setCurrentPage(page);
  // const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  // const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleSelectAll = (checked: boolean) => {
    setIsChecked(!isChecked);
    if (checked && data) {
      setSelectedSearchItems(new Set(advancedSearchData.queries.map((item) => item.id)));
    } else {
      setSelectedSearchItems(new Set());
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedSearchItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedSearchItems(newSelected);
  };

  const handleItemsPerPage = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page
    await new Promise((resolve) => setTimeout(resolve, 500));
    refetch();
  };

  //

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      <div className="w-full bg-gray-100 p-12">
        <div className="advancedSearchOptions flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Search size={16} className="font-black" />
            <h2 className="font-black">Start a new query</h2>
          </div>
          <div className="queryTypeSelection">
            <ul className="mx-auto flex w-full gap-4 max-sm:flex-col">
              <li className="border-sm group flex w-1/3 justify-between rounded-md bg-white p-4 font-bold shadow-md max-sm:w-full">
                <CreateQueryDialog queryType={`technologies/materials`} icon="Rainbow" />
              </li>
              <li className="border-sm group flex w-1/3 justify-between rounded-md bg-white p-4 font-bold shadow-md max-sm:w-full">
                <CreateQueryDialog queryType={`scientific papers`} icon="Beaker" />
              </li>
              <li className="border-sm group flex w-1/3 justify-between rounded-md bg-white p-4 font-bold shadow-md max-sm:w-full">
                <CreateQueryDialog queryType={`patents`} icon="Award" />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex h-full w-full flex-col px-12 max-sm:px-4">
        <div className="mb-2 flex items-center justify-between gap-1 rounded-lg">
          <div className="flex items-center gap-2">
            <Checkbox
              id="select-all"
              checked={
                data ? selectedSearchItems.size === advancedSearchData?.queries.length : false
              }
              onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
              className="ml-4"
            />
            {isChecked && (
              <div className="ml-4 flex gap-2">
                <a href="#" className="trashCan">
                  <Trash2 size={18} />
                </a>
              </div>
            )}
          </div>

          <div className="mr-[1.5em]">
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPage}
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
            <div className="text-red-600">Error loading items: {JSON.stringify(error)}</div>
          )}
          {isLoading && <DocumentsSkeleton />}
          {data && (
            <div>
              {advancedSearchData &&
                advancedSearchData.queries.map((item) => (
                  <GenericCard
                    id={item.id}
                    itemType="advancedSearchItem"
                    key={item.id}
                    {...item}
                    isSelected={selectedSearchItems.has(item.id)}
                    onSelect={handleSelectItem}
                    connectedObjects={item.connectedObjects}
                  />
                ))}
            </div>
          )}
        </CardContent>
      </div>
    </>
  );
};

export default AdvancedSearch;
