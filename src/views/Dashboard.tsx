import { useGetLinkingQuery, useGetMyRecentActivityQuery } from "@/api/activity/activityApi";
import { currentUser } from "@/api/auth/authSlice";
import AskIgorModal from "@/components/common/dialogs/ask-igor";
import ForceDirectedGraphView from "@/components/common/layout/force-directed-graph";
import { SearchForm } from "@/components/common/sidebar/main-sidebar/search-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { ChevronRight, Loader, Plus } from "lucide-react";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { t } = useTranslation();
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const { data: activityData, isLoading: activityDataIsLoading } = useGetMyRecentActivityQuery();
  const { data: linkingData, isLoading: linkingDataIsLoading } = useGetLinkingQuery();

  const navigate = useNavigate();
  const user = useSelector(currentUser);

  const handleNavigateToEntities = (type: string, id: string) => {
    const redirRoute = type === "Entity" ? "entities" : "studies";
    navigate(`/pages/${redirRoute}/${id}`, { state: { id } });
  };

  return (
    <div className="flex h-full w-full">
      {/* 📌 LEFT COLUMN (Scrollable) */}
      <div className="h-full w-full flex-1 overflow-y-auto bg-gray-100 p-5 md:w-1/2">
        <SearchForm className="border border-neutral-200" />

        <div className="mb-4 py-4">
          <AskIgorModal />
        </div>

        {/* 📌 Create Project Section */}
        <div>
          <h3 className="text-md mb-2 font-semibold">Get started</h3>
          <div className="flex h-[200px] justify-between rounded-lg bg-gradient-to-br from-black from-[0%] via-black via-blue-300 via-slate-700 via-[70%] via-[85%] via-[95%] to-yellow-300 to-[100%] p-4">
            <p className="text-normal font-bold text-white">Create a new project</p>
            <div className="flex items-start gap-4">
              <Plus size={20} className="text-white" />
            </div>
          </div>
        </div>

        {/* 📌 Recent Projects */}
        <div>
          <h3 className="text-md mb-2 mt-12 font-semibold">Recent projects</h3>
          <div className="mt-4 flex-1 overflow-y-auto rounded-md">
            {activityDataIsLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader className="animate-spin text-gray-600" />
                <p className="ml-2 text-gray-700">Loading Activity Data...</p>
              </div>
            ) : (
              activityData?.slice(0, 3).map((activity: any) => (
                <div
                  key={activity.id}
                  className="mb-2 flex w-full cursor-pointer flex-row items-center justify-between rounded-md bg-white px-4 py-2 hover:bg-gray-200"
                  onClick={() => handleNavigateToEntities(activity.type, activity.id)}
                >
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-700">{activity.type}</p>
                    <h3 className="text-md font-semibold">
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
        </div>

        {/* 📌 Recent Activity Tabs */}
        <div>
          <h3 className="text-md my-2 font-semibold">Recent activity</h3>
          <Tabs defaultValue="pages" className="py-4">
            <TabsList className="flex justify-start space-x-4 bg-transparent">
              <TabsTrigger value="pages" className="px-4 py-2">
                Pages
              </TabsTrigger>
              <TabsTrigger value="sources" className="px-4 py-2">
                Sources
              </TabsTrigger>
              <TabsTrigger value="team" className="px-4 py-2">
                Team
              </TabsTrigger>
            </TabsList>

            {/* 📌 Activity Content */}
            <TabsContent value="pages" className="py-4">
              <ActivityItem title="Activity 1" />
              <ActivityItem title="Activity 2" />
            </TabsContent>

            <TabsContent value="sources" className="py-4">
              <ActivityItem title="Activity 3" />
              <ActivityItem title="Activity 4" />
            </TabsContent>

            <TabsContent value="team" className="py-4">
              <ActivityItem title="Team 1" />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 📌 RIGHT COLUMN (Fixed) */}
      <div className="sticky top-0 h-full w-full flex-1 bg-gray-100 p-5 md:w-1/2">
        <h3 className="text-lg font-semibold">Pages graph</h3>

        <div className="relative mt-4 flex h-[calc(100%-50px)] items-center justify-center rounded-md">
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

/* 📌 Reusable Activity Item Component */
const ActivityItem = ({ title }: { title: string }) => (
  <div className="mb-2 flex w-full cursor-pointer flex-row items-center justify-between rounded-md bg-white px-4 py-2 hover:bg-gray-200">
    <div className="flex flex-col">
      <h3 className="text-md font-semibold">{title}</h3>
    </div>
    <ChevronRight className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-blue-200" />
  </div>
);
