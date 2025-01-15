import {
  useGetLinkingQuery,
  useGetMaxActivityQuery,
  useGetMyRecentActivityQuery,
  useGetPageTypesQuery,
} from "@/api/activity/activityApi";
import { currentUser } from "@/api/auth/authSlice";
import ForceDirectedGraphView from "@/components/shared/layout/force-directed-graph";
import { OverlayPanel } from "@/components/shared/layout/overlay-panel";
import PackGraphView from "@/components/shared/layout/pack-graph";
import { FindestButton } from "@/components/shared/utilities/findest-button";
import UserAvatar from "@/components/shared/utilities/user-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  List,
  Loader,
  MoreHorizontal,
  Network,
  ScanEye,
  SquareArrowOutUpRight,
} from "lucide-react";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { t } = useTranslation();
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const { data: activityData, isLoading: activityDataIsLoading } = useGetMyRecentActivityQuery();
  const { data: maxActivityData, isLoading: maxActivityLoading } = useGetMaxActivityQuery();
  const { data: linkingData, isLoading: linkingDataIsLoading } = useGetLinkingQuery();
  const { data: typesData, isLoading: typesDataLoading } = useGetPageTypesQuery();

  const nodes = [
    { id: "1", data: { objectTypeEnum: "type1", text: "Node 1" }, x: 0, y: 0 },
    { id: "2", data: { objectTypeEnum: "type2", text: "Node 2" }, x: 100, y: 100 },
  ];

  const navigate = useNavigate();

  const handleNavigateToEntities = (type: string, id: string) => {
    let redirRoute;
    if (type == "Entity") {
      redirRoute = "entities";
    } else {
      redirRoute = "studies";
    }
    navigate(`/library/${redirRoute}/${id}`, { state: { id } });
  };

  const formatTimeHHMM = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const user = useSelector(currentUser);

  return (
    <div className="max-sm:px- flex h-full w-full flex-col pb-11 pl-10 pr-5 pt-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="relative flex w-full flex-col space-y-3 overflow-hidden rounded-sm bg-white max-sm:px-4">
          <h2 className="overViewTitle">
            {t("welcome")} {`${user}`}
          </h2>
          <div className="flex h-[350px] w-full flex-col items-start justify-start gap-2 overflow-y-scroll">
            {activityDataIsLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white bg-opacity-50">
                <Loader className="mx-auto mb-2 animate-spin" />
                <h3 className="font-bold text-black">Loading Activity Data</h3>
              </div>
            )}
            {activityData &&
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              activityData.map((activity: any) => (
                <div
                  key={activity.id}
                  className={`mb-2 flex w-full cursor-pointer flex-row items-start rounded-sm bg-[#e5f7fe] px-4 py-2 max-sm:px-4 ${activity.type}`}
                  onClick={() => handleNavigateToEntities(activity.type, activity.id)}
                >
                  <div className="flex w-full flex-col items-start justify-between">
                    <div className={`flex w-full items-center justify-between`}>
                      <p className="overViewText flex gap-2">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="dice-d6"
                          className="svg-inline--fa fa-dice-d6 objectItem_objectIcon__xwkQs"
                          width="12px"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path
                            fill="currentColor"
                            d="M201 10.3c14.3-7.8 31.6-7.8 46 0L422.3 106c5.1 2.8 8.3 8.2 8.3 14s-3.2 11.2-8.3 14L231.7 238c-4.8 2.6-10.5 2.6-15.3 0L25.7 134c-5.1-2.8-8.3-8.2-8.3-14s3.2-11.2 8.3-14L201 10.3zM23.7 170l176 96c5.1 2.8 8.3 8.2 8.3 14l0 216c0 5.6-3 10.9-7.8 13.8s-10.9 3-15.8 .3L25 423.1C9.6 414.7 0 398.6 0 381L0 184c0-5.6 3-10.9 7.8-13.8s10.9-3 15.8-.3zm400.7 0c5-2.7 11-2.6 15.8 .3s7.8 8.1 7.8 13.8l0 197c0 17.6-9.6 33.7-25 42.1L263.7 510c-5 2.7-11 2.6-15.8-.3s-7.8-8.1-7.8-13.8l0-216c0-5.9 3.2-11.2 8.3-14l176-96z"
                          ></path>
                        </svg>
                        {activity.type}
                      </p>
                    </div>
                    <h3 className="font-bold">{activity.name}</h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="rotated" className="h-8 w-8 bg-transparent p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <SquareArrowOutUpRight /> Open Page
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ScanEye /> Open Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Network /> Open in Tree View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <List /> Open in List View
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
          </div>
        </div>

        <div className="flex w-full flex-col space-y-3 max-sm:px-4">
          <h2 className="overViewTitle">{t("relationsGraph")}</h2>
          <div className="relative flex h-[350px] w-full items-center justify-center rounded-xl">
            <div className="forceDirectionGraph">
              {linkingDataIsLoading ? (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white bg-opacity-50">
                  <Loader className="mx-auto mb-2 animate-spin" />
                  <h3 className="font-bold text-black">Loading Relations Data</h3>
                </div>
              ) : (
                <OverlayPanel>
                  <ForceDirectedGraphView
                    initialNodes={nodes}
                    linkingData={linkingData}
                    isDashBoard={true}
                  />
                  <div className="absolute inset-0 grid place-items-center rounded-sm bg-black bg-opacity-0 transition-all duration-300 ease-in-out hover:bg-opacity-50">
                    <div className="hidden text-center group-hover:block">
                      <FindestButton
                        align="right"
                        extraClassName={
                          "rounded bg-[#3ce9f0] group-hover:bg-[#3ce9f0] px-8 py-2 text-black transition-all duration-300 ease-in-out"
                        }
                        onClick={() => navigate("/dataview", { state: { graphType: "link" } })}
                      >
                        SEE RELATIONS GRAPH
                      </FindestButton>
                    </div>
                  </div>
                </OverlayPanel>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col space-y-3 overflow-hidden max-sm:px-4">
          <h2 className="overViewTitle">{t("happening")}</h2>
          <div className="relative flex h-[320px] w-full flex-col items-start justify-start gap-1 overflow-y-scroll rounded-xl">
            {/* Show Loader */}
            {maxActivityLoading && (
              <Skeleton className="relative flex h-[320px] w-full flex-col items-start justify-start gap-1 overflow-y-scroll rounded-xl" />
            )}

            {/* Render Content When Loaded */}
            {!maxActivityLoading &&
              maxActivityData &&
              maxActivityData.map((maxActivity: object, idx: number) => (
                <div
                  key={idx}
                  className="flex w-full flex-row items-center rounded-md py-2 max-sm:px-4"
                >
                  <UserAvatar username={maxActivity?.userEmail} />
                  <div className="flex w-full items-center justify-between">
                    <p className="pl-4 text-sm">
                      <a href={`mailto:${maxActivity?.userEmail}`} className="text-blue-500">
                        {maxActivity.userEmail}
                      </a>{" "}
                      edited <strong>{maxActivity?.name}</strong>
                    </p>
                    <span className="pl-4 text-sm text-gray-500">
                      {formatTimeHHMM(maxActivity.date)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="flex w-full flex-col space-y-3 max-sm:px-4">
          <h2 className="overViewTitle">{t("pageType")}</h2>
          <div className="relative flex h-full w-full items-center justify-center rounded-xl">
            <div className="pageTypeGraph">
              {typesDataLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white bg-opacity-50">
                  <Loader className="mx-auto mb-2 animate-spin" />
                  <h3 className="text-black">Loading Page Type Data...</h3>
                </div>
              )}
              <OverlayPanel>
                <PackGraphView data={typesData} searchKeyword={searchKeyword} isDashBoard={true} />
                <div className="absolute inset-0 grid place-items-center rounded-sm bg-black bg-opacity-0 transition-all duration-300 ease-in-out hover:bg-opacity-50">
                  <div className="hidden text-center group-hover:block">
                    <FindestButton
                      align="right"
                      extraClassName={
                        "rounded bg-white group-hover:bg-white px-8 py-2 text-black transition-all duration-300 ease-in-out"
                      }
                      onClick={() => navigate("/dataview", { state: { graphType: "pack" } })}
                    >
                      SEE PAGE TYPE BREAKDOWN
                    </FindestButton>
                  </div>
                </div>
              </OverlayPanel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
