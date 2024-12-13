import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { usePrefetch, useLazyGetConnectedObjectsQuery } from "@/services/documents/documentApi";
import { BookOpenCheck, Paperclip, Fingerprint, Image, Highlighter, ExternalLink } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";

// Mapping linkedCounts keys to tObjectTypeEnum values
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
  entityCount: Fingerprint,
  imageCount: Image,
  fileCount: Paperclip,
  highlightCount: Highlighter,
};

// Props for LinkedCounts and DocumentCard
interface LinkedCounts {
  [key: string]: number;
}

interface DocumentCardProps {
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
const ConnectedObjectsDialog = ({
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
      fetchConnectedObjects({ id: documentId, type: 'document' });
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
          <li key={object.id}>{object.name} - {object.type}</li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

// DocumentCard Component
export const DocumentCard: React.FC<DocumentCardProps> = ({
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
  const [dialogDocumentId, setDialogDocumentId] = useState<string | null>(null);
  const navigate = useNavigate();
  const prefetchConnectedObjects = usePrefetch("getConnectedObjects");

  const handleCheckboxChange = (checked: boolean) => {
    onSelect(id, checked);
  };

  const handleMouseEnter = (id: string | number, key: string) => {
    const objectType = objectTypeMapping[key] || 'unknown'; // Default to 'unknown'
    prefetchConnectedObjects({ id: id.toString(), type: objectType });
    setDialogDocumentId(id.toString());
  };

  const handleCardClick = () => {
    navigate(`/library/documents/${id}`, {
      state: { id, url, title, type, abstract, createdByUsername, dateAdded },
    });
  };

  return (
    <div className="documentCard gap-4 hover:border-[#ccc]">
      
        <Checkbox
          id={`doc-${id}`}
          checked={isSelected}
          onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
          className="secondary"
        />
      
      <Card key={id} className="flex flex-row flex-1 gap-4">
        <div>
          {type || "Webpage"}
        </div>
          <div className="flex flex-col flex-1">
            <div className="px-4 cursor-pointer w-auto" onClick={handleCardClick}>
              <div className="flex flex-row gap-2">
                <h3 className="font-bold text-black text-ellipsis overflow-hidden">{title}</h3>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={20} />
                </a>
              </div>
              <ul className="flex flex-row mt-2">
                {Object.entries(linkedCounts)
                  .filter(([, value]) => value > 0)
                  .map(([key, value], idx) => {
                    const IconComponent = typeIcons[key as keyof typeof typeIcons] || null;
                    return (
                      <li
                        key={idx}
                        className="rounded-md bg-slate-100 text-black p-1 flex gap-2 items-center"
                        onMouseEnter={() => handleMouseEnter(id, key)} // Use `key` for type lookup
                        onClick={() => {
                          setShowDialog(true);
                          setDialogDocumentId(id);
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
        
        <div className="flex flex-row gap-4 items-center">       
          <div>
          {dateAdded 
              ? new Date(dateAdded).toLocaleTimeString('en-US', {
                  hour: 'numeric', 
                  minute: '2-digit', 
                  hour12: false
                }).toLowerCase()
              : '09:30'}
          </div>
          <div><p className="bg-green-200 text-white p-1 rounded-full"><UserAvatar username={createdByUsername} /></p></div>
          {/* <div>
            {new Date(dateAdded) ? new Date(dateAdded).toLocaleDateString('en-US', { 
              month: 'short',
              day: 'numeric'
            }) : null}
          </div> */}
        </div>
        </Card>
    </div>
  );
};
