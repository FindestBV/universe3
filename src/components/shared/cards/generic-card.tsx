import { useLazyGetConnectedObjectsQuery, usePrefetch } from "@/api/documents/documentApi";
import { UserAvatar } from "@/components/shared/utilities/user-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigateWithTransition } from "@/hooks/use-navigate-with-transition";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { ExternalLink, Link, Trash2 } from "lucide-react";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import LinkedCounts from "./linked-counts";

// Utility Functions
const formatDate = (date: any) =>
  date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Dec 16";

// Subcomponents
const DocumentLink = ({ url }: { url?: string }) => (
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
);

const CreatorTooltip = ({ createdByUsername }: { createdByUsername?: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button aria-label="createdByUser" className="bg-transparent p-0">
          <UserAvatar username={createdByUsername || "Unknown"} />
        </Button>
      </TooltipTrigger>
      <TooltipContent
        className="-left-100 rounded-md bg-white p-2 shadow-lg"
        side="bottom"
        align="start"
        sideOffset={5}
        alignOffset={-20}
      >
        <p>Created by {createdByUsername}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

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

export const GenericCard: React.FC<GenericCardProps> = ({
  id,
  title,
  type,
  itemType,
  description,
  dateAdded,
  createdByUsername,
  url,
  abstract,
  isSelected,
  onSelect,
  linkedCounts = {},
}) => {
  // const navigate = useNavigate();
  const prefetchConnectedObjects = usePrefetch("getConnectedObjects");
  const navigateWithTransition = useNavigateWithTransition();

  const location = useLocation();
  const currentPath = location.pathname;
  const isDocument = currentPath.includes("document");

  const handleCheckboxChange = (checked: boolean) => onSelect(id, checked);
  const handleCardClick = () => {
    const routes = {
      study: `/library/studies/${id}`,
      document: `/library/documents/${id}`,
      entity: `/library/entities/${id}`,
    };
    navigateWithTransition(routes[itemType], {
      state: { id, title, description, dateAdded, url, abstract },
    });
  };

  const linkItemToOther = (id: string) => {
    console.log(`item with ${id} linked`);
  };

  return (
    <div className="itemCard">
      <div className={`innerCardMain items-start ${isDocument ? "gap-4" : ""}`}>
        {/* Checkbox */}
        <Checkbox
          id={`card-${id}`}
          checked={isSelected}
          onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
          className="secondary mr-4 mt-1"
        />

        {/* Main Card */}
        <Card key={id} className="flex flex-1 flex-row gap-4" onClick={handleCardClick}>
          {isDocument && <div>Webpage</div>}
          <div className="flex flex-1 flex-col px-4">
            <div className="w-auto cursor-pointer">
              {!isDocument && (
                <div className="iconText">{type === "StudyTypeUndefined" ? "Study" : "Entity"}</div>
              )}
            </div>
            <div className="flex flex-row gap-2">
              <h3
                className={`overflow-hidden text-ellipsis font-bold text-black ${
                  !isDocument ? "py-2" : ""
                }`}
              >
                {title}
              </h3>
              {isDocument && <DocumentLink url={url} />}
            </div>
            <div className="flex flex-row items-center gap-4">
              <LinkedCounts
                id={id}
                linkedCounts={linkedCounts}
                prefetch={({ id, type }) => prefetchConnectedObjects({ id, type })}
                onItemClick={(id) => console.log(`Item clicked: ${id}`)}
              />
            </div>
          </div>
          <div className="flex flex-row items-start gap-2">
            <div className="flex flex-row items-center gap-4">
              <div className="time">{formatDate(dateAdded)}</div>
              <CreatorTooltip createdByUsername={createdByUsername} />
            </div>
          </div>
        </Card>
      </div>
      <div className="relative flex h-auto w-[25px]">
        {/* Hoverable Actions */}
        <div className="links">
          <a href={"#"} onClick={() => linkItemToOther(id)} className="linkedStudy">
            <Link size={14} />
          </a>
          {type !== "document" && (
            <a href="#" className="trashCan">
              <Trash2 size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenericCard;
