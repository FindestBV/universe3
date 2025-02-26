/**
 * LinkedCounts Component
 *
 * This component displays a count of different linked items related to a given entity.
 * It is primarily used for Pages (Entities/Studies) and renders chip-like elements with
 * appropriate icons and colors to indicate different linked item types.
 *
 * The component is designed to be dynamic and customizable through props, and it utilizes:
 * - **Redux Prefetching** for efficient data loading
 * - **ShadCN's Tooltip (via Radix)** to show related items on hover
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object.<string, number>} props.linkedCounts - A mapping of item types to their respective counts.
 * @param {string} props.id - Unique identifier for the entity.
 * @param {Function} [props.prefetch] - Optional function for prefetching data when hovering over an item.
 * @param {Function} [props.onItemClick] - Optional function called when an item is clicked.
 * @param {Array<Object>} [props.connectedObjects] - A list of related objects, each containing:
 *   @param {string} connectedObjects[].id - The unique ID of the related object.
 *   @param {string} connectedObjects[].name - The display name of the related object.
 *   @param {number} connectedObjects[].type - The type of the related object.
 *   @param {string} [connectedObjects[].url] - Optional URL associated with the related object.
 *
 * @example
 * <LinkedCounts
 *   id={id}
 *   linkedCounts={linkedCounts}
 *   prefetch={handlePrefetch}
 *   onItemClick={(id) => console.log(`Item clicked: ${id}`)}
 *   connectedObjects={connectedObjects}
 *   prefetchedItems={prefetchedItems}
 * />
 *
 * @returns {JSX.Element} The rendered LinkedCounts component.
 */
import useLinkedCountsData from "@/hooks/use-linked-counts-data";
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

// Mapping linkedCounts keys to object type values
const objectTypeMapping = {
  entityCount: 1,
  documentCount: 2,
  highlightCount: 3,
  studyCount: 4,
  imageCount: 5,
  fileCount: 11,
};

export const LinkedCounts = ({ linkedCounts, id, prefetch, onItemClick, prefetchedItems = [] }) => {
  const [hoveredObjects, setHoveredObjects] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [prefetchedKeys, setPrefetchedKeys] = useState(new Set()); // ✅ Track which items have been prefetched

  // ✅ Prefetch all linked data at the top level of the component
  const prefetchedData = useLinkedCountsData(id, linkedCounts, objectTypeMapping);

  useEffect(() => {
    if (prefetchedItems.length > 0) {
      setHoveredObjects((prev) => {
        const updatedObjects = { ...prev };
        prefetchedItems.forEach(({ id, type, data }) => {
          const key = Object.keys(objectTypeMapping).find((k) => objectTypeMapping[k] === type);
          if (key) {
            updatedObjects[key] = data?.map((obj) => ({ id: obj.id, name: obj.name }));
          }
        });
        return updatedObjects;
      });
    }
  }, [prefetchedItems]);

  const handleMouseEnter = (key, objectType) => {
    if (prefetchedKeys.has(key)) return; // Avoid redundant prefetches

    setLoadingStates((prev) => ({ ...prev, [key]: true }));
    prefetch?.({ id, type: objectType });

    setPrefetchedKeys((prevKeys) => new Set(prevKeys).add(key)); // Track as prefetched

    setTimeout(() => {
      const { data, isFetching } = prefetchedData[key] || {};
      if (!isFetching) {
        setHoveredObjects((prev) => ({
          ...prev,
          [key]: data || [],
        }));
        setLoadingStates((prev) => ({ ...prev, [key]: false }));
      }
    }, 300);
  };

  return (
    <TooltipProvider>
      <ul className="linkedCounts flex flex-wrap gap-2">
        {Object.entries(linkedCounts)
          .filter(([, value]) => value > 0)
          .map(([key, value]) => {
            const IconComponent = typeIcons[key] || null;
            const objectType = objectTypeMapping[key] || -1;
            const { data, isFetching } = prefetchedData[key] || {};
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
                    {isFetching ? "Loading..." : ""}
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
