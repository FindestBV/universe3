import { UserAvatar } from "@/components/shared/user-avatar";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useLazyGetConnectedObjectsQuery, usePrefetch } from "@/services/study/studyApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import {
  BookOpenCheck,
  Fingerprint,
  Highlighter,
  Image,
  Link,
  List,
  MoreHorizontal,
  Network,
  Paperclip,
  ScanEye,
  SquareArrowOutUpRight,
  Trash2,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { LinkedCounts } from "./linked-counts";

// Mapping linkedCounts keys to objectTypeEnum values
export const objectTypeMapping: { [key: string]: number } = {
  entityCount: 1,
  documentCount: 2,
  highlightCount: 3,
  studyCount: 4,
  imageCount: 5,
  scienceArticleCount: 6,
  usPatentCount: 7,
  weblinkCount: 8,
  magPatentCount: 9,
  commentCount: 10,
  fileCount: 11,
  tenantCount: 12,
  organizationCount: 13,
  caseCount: 14,
  queryCount: 15,
};

// Icons for types
const typeIcons = {
  studyCount: BookOpenCheck,
  documentCount: BookOpenCheck,
  entityCount: Fingerprint,
  imageCount: Image,
  fileCount: Paperclip,
  highlightCount: Highlighter,
};

// Props for LinkedCounts and StudyCard
interface LinkedCounts {
  [key: string]: number;
}

interface StudyCardProps {
  id?: string;
  url?: string;
  title?: string;
  type: string;
  abstract?: string;
  dateAdded?: string;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  linkedCounts: LinkedCounts;
}

// ConnectedObjectsDialog Component
export const ConnectedObjectsDialog = ({
  studyId,
  onClose,
}: {
  studyId: string;
  onClose: () => void;
}) => {
  const [fetchConnectedObjects, { data: connectedObjects, isFetching }] =
    useLazyGetConnectedObjectsQuery();

  useEffect(() => {
    if (studyId) {
      fetchConnectedObjects({ id: studyId, type: "study" });
    }
  }, [studyId, fetchConnectedObjects]);

  if (isFetching) {
    return <div>Loading connected objects...</div>;
  }

  return (
    <div className="dialog">
      <h4>Connected Objects</h4>
      <ul>
        {connectedObjects?.map((object) => (
          <li key={object.id}>
            {object.name} - {object.type}
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

// StudyCard Component
export const StudyCard: React.FC<StudyCardProps> = ({
  id,
  url,
  title,
  type,
  abstract,
  createdByUsername,
  dateAdded,
  isSelected,
  onSelect,
  linkedCounts,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogStudyId, setDialogStudyId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCheckboxChange = (checked: boolean) => {
    onSelect(id, checked);
  };

  const prefetchConnectedObjects = usePrefetch("getConnectedObjects");

  const handlePrefetch = ({ id, type }: { id: string; type: string }) => {
    console.log(`Prefetching data for ID: ${id}, Type: ${type}`);
    prefetchConnectedObjects({ id, type });
  };

  const handleItemClick = (id: string) => {
    console.log(`Item clicked: ${id}`);
    setDialogId(id);
    setShowDialog(true);
  };

  const handleCardClick = () => {
    navigate(`/library/studies/${id}`, {
      state: { id, url, title, type, abstract, createdByUsername, dateAdded },
    });
  };

  return (
    <div className="itemCard">
      <div className="innerCardMain items-start">
        <Checkbox
          id={`study-${id}`}
          checked={isSelected}
          onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
          className="secondary mr-4"
        />
        <Card key={id} className="flex flex-1 flex-row gap-4">
          <div className="flex flex-1 flex-col">
            <div className="w-auto cursor-pointer px-4" onClick={handleCardClick}>
              <div className="iconText">
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
                Study
              </div>
              <div className="flex flex-row gap-2">
                <h3 className="overflow-hidden text-ellipsis py-2 text-lg font-bold text-black">
                  {title}
                </h3>
              </div>
              <LinkedCounts
                id={id}
                linkedCounts={linkedCounts}
                prefetch={handlePrefetch} // Pass the prefetch logic
                onItemClick={handleItemClick}
              />
            </div>
          </div>
          <div className="flex flex-row items-start gap-2">
            <div className="flex flex-row items-center gap-4">
              <div className="time">
                {dateAdded
                  ? new Date(dateAdded).toLocaleDateString("en-US", {
                      month: "short", // Displays the abbreviated month name (e.g., "Dec")
                      day: "numeric", // Displays the day of the month (e.g., "16")
                    })
                  : "Dec 16"}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button aria-label="createdbyUser" className="bg-transparent p-0">
                      <UserAvatar username={"Ro"} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    className="-left-100 rounded-md bg-white p-2 shadow-lg"
                    side="bottom"
                    align="start"
                    sideOffset={5} // Adjust vertical distance from trigger
                    alignOffset={-20} // Adjust horizontal alignment
                  >
                    <p>Created by {createdByUsername}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
          </div>
        </Card>
      </div>

      <div className="relative flex h-auto w-[25px]">
        <div className="links">
          <a href={url ? url : "#"} className="linkedStudy">
            <Link size={14} />
          </a>
          <a href="#" className="trashCan">
            <Trash2 size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};
