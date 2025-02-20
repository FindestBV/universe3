/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLazyGetConnectedObjectsQuery, usePrefetch } from "@/api/documents/documentApi";
import openAccessLogo from "@/assets/openAccessLogo.png";
import { UserAvatar } from "@/components/common/utilities/user-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import {
  BookOpenCheck,
  ExternalLink,
  Fingerprint,
  Highlighter,
  Image,
  Link,
  Paperclip,
  Trash2,
} from "lucide-react";

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { LinkedCounts } from "./linked-counts";

// Mapping linkedCounts keys to tObjectTypeEnum values
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
  documentCount: BookOpenCheck,
  studyCount: BookOpenCheck,
  entityCount: Fingerprint,
  imageCount: Image,
  fileCount: Paperclip,
  highlightCount: Highlighter,
};

// Props for LinkedCounts and DocumentCard
interface LinkedCounts {
  [key: string]: number;
}

interface DocumentCardProps {
  id: string;
  url: string;
  title: string;
  type: string;
  abstract?: string;
  dateAdded?: string;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  linkedCounts: LinkedCounts;
  images?: [];
}
// ConnectedObjectsDialog Component
export const ConnectedObjectsDialog = ({
  documentId,
  onClose,
}: {
  documentId: string;
  onClose: () => void;
}) => {
  const [fetchConnectedObjects, { data: connectedObjects, isFetching }] =
    useLazyGetConnectedObjectsQuery();

  useEffect(() => {
    if (documentId) {
      fetchConnectedObjects({ id: documentId, type: "document" });
    }
  }, [documentId, fetchConnectedObjects]);

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

// DocumentCard Component
export const InboxCard: React.FC<DocumentCardProps> = ({
  id,
  url,
  title,
  type,
  abstract,
  images,
  createdByUsername,
  isOpenAccess,
  dateAdded,
  isSelected,
  onSelect,
  linkedCounts,
}) => {
  // const [showDialog, setShowDialog] = useState(false);
  // const [dialogDocumentId, setDialogDocumentId] = useState<string | null>(null);

  console.log("any images?", images ? images[0]?.path : null);

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
    // setDialogId(id);
    // setShowDialog(true);
  };

  const handleCardClick = () => {
    navigate(`/sources/${id}`, {
      state: { id, url, title, type, abstract, createdByUsername, dateAdded },
    });
  };

  return (
    <div className="inboxCard">
      <div className="innerCardMain items-start gap-6">
        <Checkbox
          id={`doc-${id}`}
          checked={isSelected}
          onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
          className="secondary mr-4 mt-1"
        />

        <Card key={id} className="flex flex-1 flex-row gap-4">
          <div>{type || "Webpage"}</div>
          <div className="flex flex-1 flex-col">
            <div className="w-auto cursor-pointer px-4" onClick={handleCardClick}>
              <div className="flex flex-row gap-2">
                <h3 className="title">
                  {isOpenAccess && (
                    <img
                      className="openAccess_openAccessLogo__Q-5ld h-4"
                      src={openAccessLogo}
                      alt="Open Access Logo"
                    ></img>
                  )}
                  {title}
                  {url ? (
                    <div className="group">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-25 transition-opacity group-hover:opacity-100"
                      >
                        <ExternalLink size={20} />
                      </a>
                    </div>
                  ) : null}
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

          {/* {images && images[0]?.path ? (
            <div className="w-1/4">
              <img src={images[0].path} alt={title} className="inbox-image" />
            </div>
          ) : null} */}

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
            </div>
          </div>
        </Card>
      </div>
      <div className="relative flex h-auto w-[25px]">
        <div className="links">
          <a href="#" className="linkedStudy">
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

export default InboxCard;
