import { BookOpenCheck, Fingerprint, Highlighter, Image, Paperclip } from "lucide-react";

import React from "react";

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
  prefetch?: (args: { id: string; type: number }) => void; // Prefetch function with type as a number
  onItemClick?: (id: string) => void;
}

export const LinkedCounts: React.FC<LinkedCountsProps> = ({
  linkedCounts,
  id,
  prefetch,
  onItemClick,
}) => {
  return (
    <ul className="linkedCounts gap-2">
      {Object.entries(linkedCounts)
        .filter(([, value]) => value > 0)
        .map(([key, value], idx) => {
          const IconComponent = typeIcons[key as keyof typeof typeIcons] || null;
          const objectType = objectTypeMapping[key] || -1; // Map key to type or use -1 if not found

          return (
            <li
              key={idx}
              className={`linkedCounts__item ${key}`}
              onMouseEnter={() => prefetch({ id, type: objectType })} // Pass correct object type
              onClick={() => onItemClick(id)}
            >
              {IconComponent && <IconComponent size={16} />}
              {value}
            </li>
          );
        })}
    </ul>
  );
};

export default LinkedCounts;
