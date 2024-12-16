import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { UserAvatar } from "@/components/user-avatar";
import { useLazyGetConnectedObjectsQuery, usePrefetch } from "@/services/documents/documentApi";
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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "./ui/button";

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
  createdByUsername,
  dateAdded,
  isSelected,
  onSelect,
  linkedCounts,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogDocumentId, setDialogDocumentId] = useState<string | null>(null);
  const navigate = useNavigate();
  const prefetchConnectedObjects = usePrefetch("getConnectedObjects");

  const handleCheckboxChange = (checked: boolean) => {
    onSelect(id, checked);
  };

  const handleMouseEnter = (id: string | number, key: string) => {
    const objectType = objectTypeMapping[key] || "unknown"; // Default to 'unknown'
    prefetchConnectedObjects({ id: id.toString(), type: objectType });
    setDialogDocumentId(id.toString());
  };

  const handleCardClick = () => {
    navigate(`/library/documents/${id}`, {
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
          className="secondary mt-1"
        />

        <Card key={id} className="flex flex-1 flex-row gap-4">
          <div>{type || "Science"}</div>
          <div className="flex flex-1 flex-col">
            <div className="w-auto cursor-pointer px-4" onClick={handleCardClick}>
              <div className="flex flex-row gap-2">
                <h3 className="title">{title}</h3>
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
              </div>
              <ul className="linkedCounts">
                {Object.entries(linkedCounts)
                  .filter(([, value]) => value > 0)
                  .map(([key, value], idx) => {
                    const IconComponent = typeIcons[key as keyof typeof typeIcons] || null;
                    return (
                      <li
                        key={idx}
                        className={`linkedCounts__item ${key}`}
                        onMouseEnter={() => handleMouseEnter(id, key)} // Use `key` for type lookup
                        onClick={() => {
                          setShowDialog(true);
                          setDialogDocumentId(id);
                        }}
                      >
                        {IconComponent && <IconComponent size={16} />}
                        {value}
                      </li>
                    );
                  })}
              </ul>
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
