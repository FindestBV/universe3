import { lazy } from "react";
// lazy comps
const SortableTable = lazy(() => import("@/components/data-table/sortable-table"));
const DataChart = lazy(() => import("@/components/data-chart"));
const SearchProgress = lazy(() => import("@/components/search-progress"));

const Inbox = () => (
  <div className="flex flex-col gap-y-4 w-full h-screen">
    {/* <CountBtn /> */}
    <SortableTable />
    <div className="w-full flex gap-10 p-6">
      <div className="w-1/2">
        <DataChart />
      </div>
      <div className="w-1/2">
        <SearchProgress />
      </div>
    </div>
  </div>
);

export default Inbox