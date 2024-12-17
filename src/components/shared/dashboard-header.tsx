/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGetMyRecentActivityDropdownQuery } from "@/services/activity/activityApi";
import { useGetMyDocumentInboxQuery } from "@/services/documents/documentApi";
// import { setCredentials } from '@/services/auth';
import {
  Clock,
  List,
  MoreHorizontal,
  Network,
  Pin,
  ScanEye,
  Search,
  SquareArrowOutUpRight,
} from "lucide-react";

// import { useFeature } from "use-feature";
// import { useTranslation } from "react-i18next";

import CreateItemModal from "./create-item-modal";
import ExplorerModal from "./explorer-modal";
import HappinessSelector from "./happiness-selector";
import LanguageSelector from "./language-selector";
import SearchBar from "./searchbar";

interface DashboardHeader {
  className?: string;
}

export enum ActivityTypeEnum {
  Create = 1,
  Update = 2,
  Open = 3,
  Delete = 4,
}

const activityTypeMapping: { [key: number]: string } = {
  1: "Created",
  2: "Edited",
  3: "Viewed",
  4: "Deleted",
};

export const DashboardHeader = () => {
  // const { t } = useTranslation();
  const { data: activityData } = useGetMyRecentActivityDropdownQuery();
  const { data: documentInbox } = useGetMyDocumentInboxQuery();

  console.log("documentInbox", documentInbox);
  return (
    <header className="dashBoardHeader">
      <div className="control-buttons">
        <ul className="flex gap-1">
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open dropdown"
                  className="mt-1 h-8 w-8 p-0" // Align trigger with slight top margin
                >
                  <Clock width={20} color="black" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>

              {/* Dropdown Content */}
              <DropdownMenuContent
                align="end"
                side="right"
                className="-ml-8 mt-12 w-fit rounded-md border border-gray-200 bg-white p-2 shadow-lg"
              >
                {activityData &&
                  activityData.map((activity: any, idx: string) => (
                    <DropdownMenuItem
                      key={idx}
                      className="cursor-pointer items-center justify-between rounded-md px-2 py-1 text-black hover:bg-gray-100"
                    >
                      <div className="flex w-full items-center justify-between gap-4">
                        <div className="flex items-center gap-4 px-1">
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

                          <p>{activity.name}</p>
                        </div>
                        <Button className="py-1">
                          {activityTypeMapping[activity.activityType] || "Unknown"}
                        </Button>
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
                    </DropdownMenuItem>
                  ))}

                {/* <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer rounded-md px-2 py-1">
                <List /> Open in List View
              </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <li>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button aria-label="Pinned" className="p-2">
                    <Pin width={20} color="black" fill="black" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pinned</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li>
            <ExplorerModal />
          </li>

          <li>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="relative p-2" aria-label="Active queries">
                    <a href="/inbox">
                      <span className="indicator">
                        {documentInbox ? documentInbox.documents.length : 1}
                      </span>
                      <Search width={20} color="black" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>No active queries</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </div>
      <div className="hidden sm:block">
        <SearchBar />
      </div>

      <div className="flex items-center gap-2">
        <LanguageSelector />
        <div className="create-action hidden items-center gap-2 sm:flex">
          <CreateItemModal />
          <HappinessSelector />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
