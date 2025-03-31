import { useGetLinkingQuery, useGetMyRecentActivityQuery } from "@/api/activity/activityApi";
import { currentUser } from "@/api/auth/authSlice";
import AskIgorModal from "@/components/common/dialogs/ask-igor";
import CreateItemModal from "@/components/common/dialogs/create-item-dialog";
import SessionDialog from "@/components/common/dialogs/session-dialog";
import ForceDirectedGraphView from "@/components/common/layout/force-directed-graph";
import TreeView from "@/components/common/layout/tree-view";
import TreeView2 from "@/components/common/layout/tree-view-2";
import TreeViewStatic from "@/components/common/layout/tree-view-static";
import SearchBar from "@/components/common/search/searchbar";
import { useNavigateWithTransition } from "@/hooks/use-navigate-with-transition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { ChevronRight, Loader, Plus } from "lucide-react";
import { useFeature } from "use-feature";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const Example = () => {
  const showFeature = useFeature("MY_FEATURE"); // either pass a boolean as a second value or set an environment variable `MY_FEATURE=true`

  return showFeature ? <p>THIS IS THE FEATURE</p> : null;
};

export const Dashboard = () => {
  const { t } = useTranslation();
  // const [searchKeyword, setSearchKeyword] = useState<string>("");
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
    <div className="mainDashboard">
      {/* LEFT COLUMN (Scrollable) */}
      <div className="leftColumn">
        <Example />
        <SearchBar />
        <SessionDialog />
        <div className="mb-4 py-4">
          <AskIgorModal />
        </div>

        {/* Create Project Section */}
        <div className="create_project">
          <h3 className="title">Get started</h3>
          <CreateItemModal title={"Create a new project"} />
        </div>

        {/* Recent Projects */}
        <div className="recent_projects">
          <h3 className="title">Recent projects</h3>
          <div className="projects_container">
            {activityDataIsLoading ? (
              <div className="activity_loader">
                <Loader className="animate-spin text-gray-600" />
                <p className="loadingText">Loading Activity Data...</p>
              </div>
            ) : (
              activityData?.slice(0, 3).map((activity: any) => (
                <div
                  key={activity.id}
                  className="activity_list"
                  onClick={() => handleNavigateToEntities(activity.type, activity.id)}
                >
                  <div className="item">
                    <h3 className="text-sm font-semibold">
                      {activity.name.length > 80
                        ? `${activity.name.slice(0, 80)}...`
                        : activity.name}
                    </h3>
                  </div>
                  <ChevronRight className="icon" />
                </div>
              ))
            )}
          </div>
          <div className="loadMore">
            <div className="toggleWrapper">
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
      <div className="rightColumn">
        <h3 className="text-lg font-semibold">Pages graph</h3>

        <div className="relative mt-4 flex h-full items-center justify-center overflow-hidden rounded-md">
          {linkingDataIsLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader className="animate-spin text-gray-600" />
              <p className="ml-2 text-gray-700">Loading Relations Data...</p>
            </div>
          ) : (
            // <ForceDirectedGraphView linkingData={linkingData} isDashBoard={true} />
            <>
              {/* <TreeView data={linkingData} /> */}
              <TreeViewStatic />
            </>
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
