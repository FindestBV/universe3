import { useGetLinkingQuery, useGetMyRecentActivityQuery } from "@/api/activity/activityApi";
import { currentUser } from "@/api/auth/authSlice";
import AskIgorModal from "@/components/common/dialogs/ask-igor";
import CreateItemModal from "@/components/common/dialogs/create-item-modal";
import ForceDirectedGraphView from "@/components/common/layout/force-directed-graph";
import SearchBar from "@/components/common/search/searchbar";
import { SearchForm } from "@/components/common/sidebar/v2/search-form";
import { useNavigateWithTransition } from "@/hooks/use-navigate-with-transition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { ChevronRight, Loader, Plus } from "lucide-react";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { t } = useTranslation();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [activeTabActive, setIsActiveTabActive] = useState<string>("pages");

  const { data: activityData, isLoading: activityDataIsLoading } = useGetMyRecentActivityQuery();
  const { data: linkingData, isLoading: linkingDataIsLoading } = useGetLinkingQuery();

  // const navigate = useNavigate();
  const navigateWithTransition = useNavigateWithTransition();
  const user = useSelector(currentUser);

  const handleNavigateToEntities = (type: string, id: string) => {
    // const redirRoute = type === "Entity" ? "entities" : "studies";
    navigateWithTransition(`/projects/${id}`, { state: { id } });
  };

  return (
    <div className="scrollbar-hidden flex h-screen w-full overflow-hidden">
      {/* LEFT COLUMN (Scrollable) */}
      <div className="flex h-full w-full flex-1 flex-col overflow-y-auto bg-gray-100 py-5 pl-16 pr-8 md:max-w-[40%]">
        <SearchBar />

        <div className="mb-4 py-4">
          <AskIgorModal />
        </div>

        {/* Create Project Section */}
        <div>
          <h3 className="text-md mb-2 font-semibold">Get started</h3>
          <CreateItemModal title={"Create a new project"} />
        </div>

        {/* Recent Projects */}
        <div>
          <h3 className="text-md mb-2 mt-12 font-semibold">Recent projects</h3>
          <div className="mt-4 flex flex-col space-y-2">
            {activityDataIsLoading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader className="animate-spin text-gray-600" />
                <p className="ml-2 text-gray-700">Loading Activity Data...</p>
              </div>
            ) : (
              activityData?.slice(0, 3).map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex w-full cursor-pointer flex-row items-center justify-between rounded-md bg-white p-4 hover:bg-gray-200"
                  onClick={() => handleNavigateToEntities(activity.type, activity.id)}
                >
                  <div className="flex flex-col">
                    <h3 className="text-sm font-semibold">
                      {activity.name.length > 80
                        ? `${activity.name.slice(0, 80)}...`
                        : activity.name}
                    </h3>
                  </div>
                  <ChevronRight className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-blue-200" />
                </div>
              ))
            )}
          </div>
          <div className="h-50 group mt-2 flex items-center justify-center bg-gray-100">
            <div className="mx-auto flex w-full items-center justify-center rounded-sm bg-slate-200 p-2 group-hover:bg-slate-300">
              <Plus
                size={24}
                className="cursor-pointer text-slate-300 group-hover:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Recent Activity Tabs */}
        <div className="mt-6">
          <h3 className="text-md my-2 font-semibold">Recent activity</h3>
          <Tabs defaultValue="pages" className="pb-4" onValueChange={setIsActiveTabActive}>
            <TabsList className="flex justify-start space-x-4 border-b border-slate-200 bg-transparent">
              <TabsTrigger
                value="pages"
                className={`linear p-2 text-sm transition-all duration-150 ${
                  activeTabActive === "pages"
                    ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                    : "text-gray-500"
                }`}
              >
                Pages
              </TabsTrigger>
              <TabsTrigger
                value="sources"
                className={`linear p-2 text-sm transition-all duration-150 ${
                  activeTabActive === "sources"
                    ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                    : "text-gray-500"
                }`}
              >
                Sources
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className={`linear p-2 text-sm transition-all duration-150 ${
                  activeTabActive === "team"
                    ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                    : "text-gray-500"
                }`}
              >
                Team
              </TabsTrigger>
            </TabsList>

            {/* Activity Content */}
            <TabsContent value="pages" className="py-4 text-sm">
              <ActivityItem title="Activity 1" />
              <ActivityItem title="Activity 2" />
            </TabsContent>

            <TabsContent value="sources" className="py-4 text-sm">
              <ActivityItem title="Activity 3" />
              <ActivityItem title="Activity 4" />
            </TabsContent>

            <TabsContent value="team" className="py-4 text-sm">
              <ActivityItem title="Team 1" />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* RIGHT COLUMN (Fixed) */}
      <div className="flex-2 h-screen w-full bg-gray-100 p-5 md:max-w-[60%]">
        <h3 className="text-lg font-semibold">Pages graph</h3>

        <div className="relative mt-4 flex h-full items-center justify-center overflow-hidden rounded-md">
          {linkingDataIsLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader className="animate-spin text-gray-600" />
              <p className="ml-2 text-gray-700">Loading Relations Data...</p>
            </div>
          ) : (
            <ForceDirectedGraphView linkingData={linkingData} isDashBoard={true} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

/* Reusable Activity Item Component */
const ActivityItem = ({ title }: { title: string }) => (
  <div className="mb-2 flex w-full cursor-pointer flex-row items-center justify-between rounded-md bg-white p-4 hover:bg-gray-200">
    <div className="flex flex-col">
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
    <ChevronRight className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-blue-200" />
  </div>
);
