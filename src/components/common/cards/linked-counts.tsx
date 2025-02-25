import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { BookOpenCheck, Fingerprint, Highlighter, Image, Paperclip } from "lucide-react";

import { useEffect, useState } from "react";

// Icons for types
const typeIcons = {
  documentCount: BookOpenCheck,
  studyCount: BookOpenCheck,
  entityCount: Fingerprint,
  imageCount: Image,
  fileCount: Paperclip,
  highlightCount: Highlighter,
};

// Mapping linkedCounts keys to tObjectTypeEnum values
const objectTypeMapping = {
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

const LinkedCounts = ({
  linkedCounts,
  id,
  prefetch,
  onItemClick,
  connectedObjects = [],
  prefetchedItems = [],
}) => {
  const [hoveredObjects, setHoveredObjects] = useState({});

  useEffect(() => {
    console.log("Received prefetchedItems:", prefetchedItems);
    // Merge prefetched items into hoveredObjects state when they change
    if (prefetchedItems.length > 0) {
      setHoveredObjects((prev) => {
        const updatedObjects = { ...prev };
        prefetchedItems.forEach(({ id, type, data }) => {
          console.log("Processing prefetched item:", { id, type, data });
          const key = Object.keys(objectTypeMapping).find((k) => objectTypeMapping[k] === type);
          if (key) {
            updatedObjects[key] = data && data.map((obj) => ({ id: obj.id, name: obj.name }));
          }
        });
        console.log("Updated hoveredObjects:", updatedObjects);
        return updatedObjects;
      });
    }
  }, [prefetchedItems]);

  const handleMouseEnter = async (key, objectType) => {
    console.log(`Mouse entered on ${key}, fetching related objects...`);
    if (!hoveredObjects[key]) {
      try {
        const result = await prefetch?.({ id, type: objectType });
        console.log(`Fetched result for ${key}:`, result);
        if (result && Array.isArray(result)) {
          setHoveredObjects((prev) => ({
            ...prev,
            [key]: result.map((obj) => ({ id: obj.id, name: obj.name })),
          }));
        }
      } catch (error) {
        console.error("Error fetching related objects:", error);
      }
    }
  };

  return (
    <TooltipProvider>
      <ul className="linkedCounts flex flex-wrap gap-2">
        {Object.entries(linkedCounts)
          .filter(([, value]) => value > 0)
          .map(([key, value]) => {
            const IconComponent = typeIcons[key] || null;
            const objectType = objectTypeMapping[key] || -1;
            const relatedObjects =
              hoveredObjects[key] || connectedObjects?.filter((obj) => obj.type === objectType);

            console.log(`Rendering linkedCounts item: ${key}, relatedObjects:`, relatedObjects);

            return (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <li
                    className={`linkedCounts__item ${key}`}
                    onMouseEnter={() => handleMouseEnter(key, objectType)}
                    onClick={() => onItemClick?.(id)}
                  >
                    {IconComponent && <IconComponent size={16} />}
                    {value}
                  </li>
                </TooltipTrigger>
                <TooltipContent side="top" className="z-50 rounded-md bg-white p-2 shadow-lg">
                  <ul className="tooltipContent">
                    {relatedObjects.length > 0 ? (
                      relatedObjects.map((obj) => <li key={obj.id}>{obj.name}</li>)
                    ) : (
                      <li className="text-sm">No related items</li>
                    )}
                  </ul>
                </TooltipContent>
              </Tooltip>
            );
          })}
      </ul>
    </TooltipProvider>
  );
};

export default LinkedCounts;
