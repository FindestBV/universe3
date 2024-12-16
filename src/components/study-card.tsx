import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { usePrefetch, useLazyGetConnectedObjectsQuery } from "@/services/study/studyApi";
import { BookOpenCheck, Paperclip, Fingerprint, Image, Highlighter, List, MoreHorizontal, Network, ScanEye, SquareArrowOutUpRight } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";

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
      fetchConnectedObjects({ id: studyId, type: 'study' });
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
          <li key={object.id}>{object.name} - {object.type}</li>
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
  const prefetchConnectedObjects = usePrefetch("getConnectedObjects");

  const handleCheckboxChange = (checked: boolean) => {
    onSelect(id, checked);
  };

  const handleMouseEnter = (id: string | number, key: string) => {
    const objectType = objectTypeMapping[key] || 'unknown'; // Default to 'unknown'
    prefetchConnectedObjects({ id: id.toString(), type: objectType });
    setDialogStudyId(id.toString());
  };

  const handleCardClick = () => {
    navigate(`/library/studies/${id}`, {
      state: { id, url, title, type, abstract, createdByUsername, dateAdded },
    });
  };

  return (
    <div className="studyCard gap-4 hover:border-[#ccc]">
      <Checkbox
        id={`study-${id}`}
        checked={isSelected}
        onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
        className="secondary"
      />
      <Card key={id} className="flex flex-row flex-1 gap-4">
        
        <div className="flex flex-col flex-1">
          <div className="px-4 cursor-pointer w-auto" onClick={handleCardClick}>
            <div>{type || "Study"}</div>
            <div className="flex flex-row gap-2">
              <h3 className="font-bold text-black text-ellipsis overflow-hidden">{title}</h3>
            </div>
            <ul className="linkedCounts">
              {Object.entries(linkedCounts)
                .filter(([, value]) => value > 0)
                .map(([key, value], idx) => {
                  const IconComponent = typeIcons[key as keyof typeof typeIcons] || null;
                  return (
                    <li
                      key={idx}
                      className="linkedCounts__item"
                      onMouseEnter={() => handleMouseEnter(id, key)}
                      onClick={() => {
                        setShowDialog(true);
                        setDialogStudyId(id);
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
        <div className="flex flex-row gap-2 items-center">
          <div className="time">
          {
              dateAdded
                ? new Date(dateAdded).toLocaleDateString('en-US', {
                    month: 'short', // Displays the abbreviated month name (e.g., "Dec")
                    day: 'numeric', // Displays the day of the month (e.g., "16")
                  })
                : 'Dec 16'}
          </div>
          <div className="avatar">
            <UserAvatar username={'Ro'} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="rotated" className="h-8 w-8 p-0 bg-transparent">
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
      </Card>
    </div>
  );
};
