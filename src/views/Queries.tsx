import { ListPagination } from "@/components/shared/layout/list-pagination";

export const Queries = () => (
  <div className="flex h-full w-full flex-col px-12 max-sm:px-4">
    <div className="flex w-full items-center justify-between">
      <h1 className="text-xl font-black text-black">Queries</h1>
      <div className="flex">
        <ListPagination
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
          onNextPage={() => {}}
          onPreviousPage={() => {}}
        />
      </div>
    </div>

    <div className="w-full py-4">
      <ListPagination
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        onNextPage={() => {}}
        onPreviousPage={() => {}}
      />
    </div>
  </div>
);

export default Queries;
