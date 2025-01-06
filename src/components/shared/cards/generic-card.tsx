import { useLazyGetConnectedObjectsQuery, usePrefetch } from "@/api/documents/documentApi";
import { AddLinkToItem } from "@/components/shared/modals/add-link-to-item";
import { UserAvatar } from "@/components/shared/utilities/user-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigateWithTransition } from "@/hooks/use-navigate-with-transition";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { ExternalLink, Link, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import LinkedCounts from "./linked-counts";

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
  connectedObjects,
  searchInformation,
  linkedCounts = {},
}) => {
  // const navigate = useNavigate();
  const [prefetchedItems, setPrefetchedItems] = useState<Record<string, any>[]>([]);
  const prefetchConnectedObjects = usePrefetch("getConnectedObjects");
  const navigateWithTransition = useNavigateWithTransition();

  // console.log("genric card description", JSON.parse(description));
  // console.log('prefetchedObjectsForItem', prefetchConnectedObjects)

  const renderFirstThreeParagraphs = (descriptionString: string) => {
    if (!descriptionString) {
      return <p>No content available.</p>;
    }

    let parsedDescription;
    try {
      parsedDescription = JSON.parse(descriptionString);
    } catch (error) {
      console.error("Error parsing description:", error);
      return <p>Invalid description format.</p>;
    }

    if (!parsedDescription.content || !Array.isArray(parsedDescription.content)) {
      return <p>No valid content found.</p>;
    }

    // Extract the first three paragraphs
    const paragraphs = parsedDescription.content
      .filter((item: any) => item.type === "paragraph")
      .slice(0, 1);

    return (
      <div>
        {paragraphs.map((paragraph: any, index: number) => (
          <p key={index}>
            {paragraph.content
              ?.map((child: any) => child.text)
              .filter(Boolean)
              .join(" ")}
          </p>
        ))}
      </div>
    );
  };

  const handlePrefetch = async ({ id, type }: { id: string; type: string }) => {
    try {
      const data = await prefetchConnectedObjects({ id, type }, { force: false });
      setPrefetchedItems((prevItems) => [...prevItems, { id, type, data }]);
    } catch (error) {
      console.log("error whle prefetching links", error);
    }
  };

  const location = useLocation();
  const currentPath = location.pathname;
  const isDocument = currentPath.includes("documents");
  const isEntity = currentPath.includes("entities");

  const handleCheckboxChange = (checked: boolean) => onSelect(id, checked);
  const handleCardClick = () => {
    const routes = {
      study: `/library/studies/${id}`,
      document: `/library/documents/${id}`,
      entity: `/library/entities/${id}`,
    };
    navigateWithTransition(routes[itemType], {
      state: {
        id,
        title,
        description,
        dateAdded,
        url,
        abstract,
        connectedObjects,
        searchInformation,
        prefetchedItems,
      },
    });
  };

  const linkItemToOther = (id: string) => {
    console.log(`item with ${id} linked`);
  };

  console.log("searchInformation", searchInformation);

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
          {isDocument && <div className="iconText">Science</div>}
          <div className="flex flex-1 flex-col px-4">
            <div className="w-auto cursor-pointer">
              {!isDocument && (
                <div className="iconText">{type === "StudyTypeUndefined" ? "Study" : "Entity"}</div>
              )}
            </div>
            <div className={`flex ${isDocument ? "flex-row" : "flex-col"} gap-2`}>
              <h3
                className={`overflow-hidden text-ellipsis font-bold text-black ${
                  !isDocument ? "py-2" : ""
                }`}
              >
                {title}
              </h3>
              {isDocument && <DocumentLink url={url} />}
              {isEntity && renderFirstThreeParagraphs(description)}
            </div>
            <div className="flex flex-row items-center gap-4">
              <LinkedCounts
                id={id}
                linkedCounts={linkedCounts}
                prefetch={({ id, type }) => handlePrefetch({ id, type })}
                onItemClick={(id) => console.log(`Item clicked: ${id}`)}
                connectedObjects={connectedObjects}
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
          <AddLinkToItem attachToItem={linkItemToOther} parentId={id} parentTitle={title} />
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
