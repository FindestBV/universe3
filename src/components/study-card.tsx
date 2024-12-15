import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useLazyGetConnectedObjectsQuery } from "@/services/documents/documentApi";
import { BookOpenCheck, Fingerprint, Highlighter, Paperclip } from "lucide-react";
import { usePrefetch } from "@/services/entities/entityApi";


interface StudyCardProps {
    id: string;
    title?: string;
    type: string;
    description?: string;
    dateAdded?: string;
    isSelected: boolean;
    onSelect: (id: string, checked: boolean) => void;
    linkedCounts?: LinkedCounts
}

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
}

export const StudyCard: React.FC<StudyCardProps> = ({ id, title, type, description, dateAdded, isSelected, onSelect, linkedCounts }) => {
    const navigate = useNavigate();
    const prefetchConnectedObjects = usePrefetch("getConnectedObjects");
    
    const handleCheckboxChange = (checked: boolean) => {
        onSelect(id, checked);
    };

    const handleMouseEnter = (id: string | number, key: string) => {
        const objectType = objectTypeMapping[key] || 'unknown'; // Default to 'unknown'
        void prefetchConnectedObjects({ id: id.toString(), type: objectType });
    };
    const handleCardClick = () => {
        // Navigate to the document view and pass the document data
        navigate(`/library/studies/${id}`, { state: { id, title, type, description, dateAdded } });
    };


    return (
      <div className="studyCard">
        <div className="flex items-start space-x-4">
            <div>
                <Checkbox
                    id={`entity-${id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
                    className="secondary"
                />
            </div>
            <div>
                <Card key={id} className="w-full bg-white text-black" onClick={handleCardClick}>
                    <div className="px-4 cursor-pointer">
                        <h3 className="font-black text-lg text-black">{title}</h3>
                        <div className="flex flex-col mt-2 text-sm">
                            {/* <div>
                                <span className="font-black text-black">Type: </span>
                                Study
                            </div>
                            <div>
                                <span className="font-black text-black">Added: </span>
                                {dateAdded ? new Date(dateAdded).toLocaleDateString() : "N/A"}
                            </div> */}
                            <ul className="flex gap-2">
                            {linkedCounts &&
                                Object.entries(linkedCounts)
                                    .filter(([, value]) => value > 0)
                                    .map(([key, value], idx) => {
                                    const IconComponent = typeIcons[key as keyof typeof typeIcons] || null;
                                    return (
                                        <li
                                        key={idx}
                                        className="linkedCounts__item"
                                        onMouseEnter={() => handleMouseEnter(id, key)}
                                        // onClick={() => {
                                        //     setShowDialog(true);
                                        //     setDialogDocumentId(id);
                                        // }}
                                        >
                                        {IconComponent && <IconComponent size={16} />}
                                        {value}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
      </div>
    );
};

export default StudyCard;