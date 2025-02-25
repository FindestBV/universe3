import { usePrefetchedData } from "@/api/documents/documentApi";
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

export const LinkedCounts = ({
  linkedCounts,
  id,
  prefetch,
  onItemClick,
  connectedObjects = [],
  prefetchedItems = [],
}) => {
  const [hoveredObjects, setHoveredObjects] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  // Iterate over linkedCounts to prefetch data for all types
  Object.entries(linkedCounts).forEach(([key]) => {
    const objectType = objectTypeMapping[key];
    if (objectType !== undefined) {
      // Call `usePrefetchedData` for each object type
      const { data, isFetching } = usePrefetchedData(id, objectType);
      if (data) {
        hoveredObjects[key] = data;
      }
    }
  });

  useEffect(() => {
    if (prefetchedItems.length > 0) {
      setHoveredObjects((prev) => {
        const updatedObjects = { ...prev };
        prefetchedItems.forEach(({ id, type, data }) => {
          console.log("Processing prefetched item:", { id, type, data });
          const key = Object.keys(objectTypeMapping).find((k) => objectTypeMapping[k] === type);
          if (key) {
            updatedObjects[key] = data?.map((obj) => ({ id: obj.id, name: obj.name }));
          }
        });
        console.log("Updated hoveredObjects:", updatedObjects);
        return updatedObjects;
      });
    }
  }, [prefetchedItems]);

  const handleMouseEnter = (key, objectType) => {
    console.log(`Mouse entered on ${key}, prefetching related objects...`);

    setLoadingStates((prev) => ({ ...prev, [key]: true }));

    prefetch?.({ id, type: objectType });

    setTimeout(() => {
      const { data, isFetching } = useGetConnectedObjectsQuery(
        { id, type: objectType },
        { skip: !id },
      );

      if (!isFetching) {
        setHoveredObjects((prev) => ({
          ...prev,
          [key]: data || [],
        }));
        setLoadingStates((prev) => ({ ...prev, [key]: false }));
      }
    }, 300); // Small delay for Redux cache update
  };

  return (
    <TooltipProvider>
      <ul className="linkedCounts flex flex-wrap gap-2">
        {Object.entries(linkedCounts)
          .filter(([, value]) => value > 0)
          .map(([key, value]) => {
            const IconComponent = typeIcons[key] || null;
            const objectType = objectTypeMapping[key] || -1;
            const relatedObjects = hoveredObjects[key] || [];

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
                      relatedObjects.map((item) => (
                        <li key={item.id} onClick={() => onItemClick(item.id)}>
                          {item?.name || item?.title} - {item?.type}
                        </li>
                      ))
                    ) : (
                      <p>No linked objects found.</p>
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
