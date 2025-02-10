import { useGetLinkingQuery, useGetMyRecentActivityQuery } from "@/api/activity/activityApi";
import { currentUser } from "@/api/auth/authSlice";
import AskIgorModal from "@/components/common/dialogs/ask-igor";
import ForceDirectedGraphView from "@/components/common/layout/force-directed-graph";
import { SearchForm } from "@/components/common/sidebar/main-sidebar/search-form";
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
    <div className="flex h-screen w-full flex-col md:flex-row">
      {/* 📌 LEFT COLUMN: List of Options */}
      <div className="flex h-full w-full flex-col bg-gray-100 p-5 md:w-1/2">
        <SearchForm className="border border-neutral-200" />

        <div className="mb-10 py-4">
          <AskIgorModal />
        </div>

        <h3 className="text-md mb-2 font-semibold">
          {/* {t("welcome")} {user} */}
          Get started
        </h3>

        <div className="flex h-[200px] justify-between rounded-lg bg-gradient-to-br from-black from-[0%] via-black via-blue-300 via-slate-700 via-[70%] via-[85%] via-[95%] to-yellow-300 to-[100%] p-4">
          <p className="text-xs font-bold text-white">Create a new project</p>
          <div className="flex items-start gap-4">
            <Plus size={20} className="text-white" />
          </div>
        </div>

        <h3 className="text-md mb-2 mt-12 font-semibold">
          {/* {t("welcome")} {user} */}
          Recent projects
        </h3>

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
                    {activity.name.length > 80 ? `${activity.name.slice(0, 80)}...` : activity.name}
                  </h3>
                </div>
                <ChevronRight className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-blue-200" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* 📌 RIGHT COLUMN: Graph */}
      <div className="flex h-screen w-full flex-col p-5 md:w-1/2">
        <h3 className="text-lg font-semibold">Pages graph</h3>

        <div className="relative mt-4 flex flex-1 items-center justify-center rounded-md">
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
