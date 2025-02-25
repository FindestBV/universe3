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
 *   linkedCounts={{ documentCount: 3, studyCount: 5 }}
 *   id="1234"
 *   prefetch={(data) => console.log("Prefetching", data)}
 *   onItemClick={(id) => console.log("Clicked", id)}
 *   connectedObjects={[{ id: "5678", name: "Study A", type: 4, url: "/study/5678" }]}
 * />
 *
 * @returns {JSX.Element} The rendered LinkedCounts component.
 */
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { BookOpenCheck, Fingerprint, Highlighter, Image, Paperclip } from "lucide-react";

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
const objectTypeMapping: { [key: string]: number } = {
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

interface LinkedCountsProps {
  linkedCounts: { [key: string]: number };
  id: string;
  prefetch?: (args: { id: string; type: number }) => void;
  onItemClick?: (id: string) => void;
  connectedObjects?: { id: string; name: string; type: number; url?: string }[];
}

export const LinkedCounts: React.FC<LinkedCountsProps> = ({
  linkedCounts,
  id,
  prefetch,
  onItemClick,
  connectedObjects = [],
}) => {
  return (
    <ul className="linkedCounts flex flex-wrap gap-2">
      {Object.entries(linkedCounts)
        .filter(([, value]) => value > 0) // Only show items with counts > 0
        .map(([key, value], idx) => {
          const IconComponent = typeIcons[key as keyof typeof typeIcons] || null;
          const objectType = objectTypeMapping[key] || -1;

          // Filter connectedObjects by type
          const relatedObjects = connectedObjects.filter((obj) => obj.type === objectType);

          return (
            <TooltipProvider key={idx}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <li
                    className={`linkedCounts__item ${key}`}
                    onMouseEnter={() => prefetch?.({ id, type: objectType })}
                    onClick={() => onItemClick?.(id)}
                  >
                    {IconComponent && <IconComponent size={16} />}
                    {value}
                  </li>
                </TooltipTrigger>
                <TooltipContent side="top" className="z-50 rounded-md bg-white p-2 shadow-lg">
                  <ul className="tooltipContent">
                    {relatedObjects.length > 0 ? (
                      relatedObjects.map((obj) => (
                        <li key={obj.id}>
                          <a href={obj.url || "#"}>{obj.name}</a>
                        </li>
                      ))
                    ) : (
                      <li>No related items</li>
                    )}
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
    </ul>
  );
};

export default LinkedCounts;
