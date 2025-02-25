import { useAdvancedSearchQuery } from "@/api/search/searchApi";
import ItemCard from "@/components/common/cards/item-card";
import CreateQueryDialog from "@/components/common/dialogs/create-query-dialog";
import { DocumentsSkeleton } from "@/components/common/loaders/documents-skeleton";
import { CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

import { useEffect, useState } from "react";

export const AdvancedSearch: React.FC = () => {
  const [selectedSearchItems, setSelectedSearchItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { data, isLoading, isError, error, refetch } = useGetStudiesQuery(
    { page: currentPage, limit: itemsPerPage },
    { refetchOnMountOrArgChange: true },
  );

  const { data: advancedSearchData, isLoading: advancedSearchDataIsLoading } =
    useAdvancedSearchQuery();

  const handleSelectAll = (checked: boolean) => {
    setIsChecked(!isChecked);
    if (checked && data) {
      setSelectedSearchItems(new Set(advancedSearchData.queries.map((item) => item.id)));
    } else {
      setSelectedSearchItems(new Set());
    }
  };

  const handleAnimationComplete = () => {
    console.log("Animation completed!");
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

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="view_advancedSearch">
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
        <CardContent className="p-0">
          {isError && (
            <div className="text-red-600">Error loading items: {JSON.stringify(error)}</div>
          )}
          {isLoading && <DocumentsSkeleton />}
          {data ? (
            <div>
              {advancedSearchData &&
                advancedSearchData.queries.map((item) => (
                  <ItemCard
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
          ) : null}
        </CardContent>
      </div>
    </div>
  );
};

export default AdvancedSearch;
