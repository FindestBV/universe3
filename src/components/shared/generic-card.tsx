import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BookOpenCheck,
  Fingerprint,
  Highlighter,
  Image,
  Link,
  Paperclip,
  Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

// Icons for linked counts
const typeIcons = {
  studyCount: BookOpenCheck,
  entityCount: Fingerprint,
  imageCount: Image,
  fileCount: Paperclip,
  highlightCount: Highlighter,
};

// GenericCard Props
interface LinkedCounts {
  [key: string]: number;
}

interface GenericCardProps {
  id: string;
  title?: string;
  type: "study" | "document" | "entity";
  description?: string;
  dateAdded?: any;
  url?: string;
  abstract?: string;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  linkedCounts?: LinkedCounts;
}

export const GenericCard: React.FC<GenericCardProps> = ({
  id,
  title,
  type,
  description,
  dateAdded,
  url,
  abstract,
  isSelected,
  onSelect,
  linkedCounts = {},
}) => {
  const navigate = useNavigate();

  const handleCheckboxChange = (checked: boolean) => onSelect(id, checked);

  const handleCardClick = () => {
    const routes = {
      study: `/library/studies/${id}`,
      document: `/library/documents/${id}`,
      entity: `/library/entities/${id}`,
    };
    navigate(routes[type], { state: { id, title, description, dateAdded, url, abstract } });
  };

  return (
    <div className="itemCard">
      <div className="innerCardMain items-start">
        {/* Checkbox */}
        <Checkbox
          id={`card-${id}`}
          checked={isSelected}
          onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
          className="secondary mr-4"
        />

        {/* Main Card */}
        <Card key={id} className="flex flex-1 flex-row gap-4" onClick={handleCardClick}>
          <div className="flex flex-1 flex-col">
            <h3 className="title">{title}</h3>
            {type !== "entity" && <p className="mt-1 text-sm">{description || abstract}</p>}

            <div className="mt-2 flex items-center">
              <span className="time">
                {dateAdded
                  ? new Date(dateAdded).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>

            {/* Linked Counts (for document type) */}
            {linkedCounts && type === "document" && (
              <div className="linkedCounts">
                {Object.entries(linkedCounts)
                  .filter(([, value]) => value > 0)
                  .map(([key, value], idx) => {
                    // @ts-ignore
                    const IconComponent = typeIcons[key] || null;
                    return (
                      <div key={idx} className="linkedCounts__item">
                        {IconComponent && <IconComponent size={16} />}
                        {value}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </Card>

        {/* Hoverable Actions */}
        <div className="links">
          <a href={url || "#"} className="linkedStudy">
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

export default GenericCard;
