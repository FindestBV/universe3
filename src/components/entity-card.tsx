import React from "react";
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface EntityCardProps {
    id: string;
    title: string;
    type: string;
    description?: string;
    dateAdded?: string;
    isSelected: boolean;
    onSelect: (id: string, checked: boolean) => void;
}

export const EntityCard: React.FC<EntityCardProps> = ({ id, title, type, description, dateAdded, isSelected, onSelect }) => {
    const navigate = useNavigate();

    const handleCheckboxChange = (checked: boolean) => {
        onSelect(id, checked);
    };

    const handleCardClick = () => {
        // Navigate to the document view and pass the document data
        navigate(`/library/entities/${id}`, { state: { id, title, type, description, dateAdded } });
    };

    return (
      <div className="space-y-4 pb-4">
        <div className="flex items-start space-x-4">
            <Checkbox
                id={`entity-${id}`}
                checked={isSelected}
                onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
                className="secondary"
            />
            <Card key={id} className="w-full bg-white text-black" onClick={handleCardClick}>
                <div className="p-4 cursor-pointer">
                    <h3 className="font-black text-lg text-black">{title}</h3>
                    <div className="flex flex-col mt-2 text-sm">
                        <div>
                            <span className="font-black text-black">Type: </span>
                            {type || "Webpage"}
                        </div>
                        <div>
                            <span className="font-black text-black">Added: </span>
                            {dateAdded ? new Date(dateAdded).toLocaleDateString() : "N/A"}
                        </div>
                        
                        
                    </div>
                </div>
            </Card>
        </div>
      </div>
    );
};
