import { useLazyGetConnectedObjectsQuery, usePrefetch } from "@/api/documents/documentApi";
import { AddLinkToItem } from "@/components/common/dialogs/add-link-to-item";
import { UserAvatar } from "@/components/common/utilities/user-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigateWithTransition } from "@/hooks/use-navigate-with-transition";
import { useTruncateText } from "@/hooks/use-truncate-text";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { ExternalLink, Plus, Trash2 } from "lucide-react";

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
  name,
  type,
  itemType,
  description,
  dateAdded,
  dateCreated,
  createdByUsername,
  url,
  abstract,
  isSelected,
  onSelect,
  connectedObjects,
  searchInformation,
  linkedCounts = {},
  images,
}) => {
  // const navigate = useNavigate();
  const [prefetchedItems, setPrefetchedItems] = useState<Record<string, any>[]>([]);
  const prefetchConnectedObjects = usePrefetch("getConnectedObjects");
  const navigateWithTransition = useNavigateWithTransition();

  // if (connectedObjects) {
  //   console.log("generic card", connectedObjects);
  // }

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
  const isSources = currentPath.includes("sources");
  const isEntity = currentPath.includes("entities");
  const isStudy = currentPath.includes("studies");
  const isAdvancedSearch = currentPath.includes("queries");

  const handleCheckboxChange = (checked: boolean) => onSelect(id, checked);
  const handleCardClick = () => {
    const routes = {
      study: `/pages/studies/${id}`,
      source: `/sources/${id}`,
      entity: `/pages/entities/${id}`,
    };
    // likely to be removed.
    navigateWithTransition(routes[itemType], {
      state: {
        id,
        title,
        description,
        dateAdded,
        dateCreated,
        url,
        abstract,
        connectedObjects,
        searchInformation,
        prefetchedItems,
        images,
      },
    });
  };

  const linkItemToOther = (id: string) => {
    console.log(`item with ${id} linked`);
  };

  const truncatedText = useTruncateText(name || title, 280);
  const itemImage = images && images[0]?.path;
  const itemCaption = images && images[0]?.caption;
  return (
    <div className="itemCard">
      <div className={`innerCardMain bg-white ${isSources ? "gap-4" : ""}`}>
        {/* Checkbox */}
        <Checkbox
          id={`card-${id}`}
          checked={isSelected}
          onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
          className="innerCardCheckbox"
        />

        {/* Main Card */}
        <Card key={id} className="innerCardContent" onClick={handleCardClick}>
          {isSources && <div className="iconText">Science</div>}
          <div className="innerCardContent__Detail">
            {/* <div className="w-auto cursor-pointer">
              {!isSources && (
                <div className="iconText py-1">
                  {itemType === "advancedSearchItem"
                    ? null
                    : type === "StudyTypeUndefined"
                      ? "Study"
                      : "Entity"}
                </div>
              )}
            </div> */}
            <div className={`flex ${isSources ? "flex-row gap-2" : "flex-col"}`}>
              <h3
                className={`overflow-hidden text-ellipsis text-lg font-bold text-black ${
                  !isSources ? "py-0" : ""
                }`}
              >
                {truncatedText}
              </h3>

              {itemType === "advancedSearchItem" && (
                <div>
                  <h5 className="iconText mb-2">Connections</h5>
                  <div className="flex flex-row flex-wrap gap-2">
                    {connectedObjects.map((obj) => {
                      return <div className="connected-object Entity gap-2">{obj.name}</div>;
                    })}
                    <Button variant="ghost" className="flex flex-row gap-2">
                      <Plus size={16} /> <i>Connect to entity or study</i>
                    </Button>
                  </div>
                </div>
              )}
              {isSources && <DocumentLink url={url} />}
              {isEntity && renderFirstThreeParagraphs(description)}
              {isStudy && renderFirstThreeParagraphs(description)}
            </div>
            <div className="innerCardContent__Links">
              <LinkedCounts
                id={id}
                linkedCounts={linkedCounts}
                prefetch={({ id, type }) => handlePrefetch({ id, type })}
                onItemClick={(id) => console.log(`Item clicked: ${id}`)}
                connectedObjects={connectedObjects}
              />
            </div>
          </div>
          {/* {isStudy && itemImage ? (
            <div className="mt-6 w-1/4 self-start">
              <img src={itemImage} alt={itemCaption} />
              {/* <figcaption>{itemCaption}</figcaption> 
            </div>
          ) : null} */}
          <div className="flex flex-row items-start gap-2">
            <div className="flex flex-row items-center gap-4">
              <div className="time">{formatDate(dateCreated ? dateCreated : dateAdded)}</div>
              {/* <CreatorTooltip createdByUsername={createdByUsername} /> */}
            </div>
          </div>
        </Card>
      </div>
      {itemType && itemType == "advancedSearchItem" ? null : (
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
      )}
    </div>
  );
};

export default GenericCard;
