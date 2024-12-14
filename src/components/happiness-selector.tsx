/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { SmilePlus } from 'lucide-react';

const HappinessSelector = () => {
  // const [selectedHappiness, setSelectedHappiness] = useState(null);

  // Happiness levels with corresponding emojis
  const happinessLevels = [
    { level: 5, emoji: '😄', label: 'Very Happy' },
    { level: 4, emoji: '🙂', label: 'Happy' },
    { level: 3, emoji: '😐', label: 'Neutral' },
    { level: 2, emoji: '🙁', label: 'Sad' },
    { level: 1, emoji: '😢', label: 'Very Sad' }
  ];

  const handleHappinessSelect = (level: { level: any; emoji?: string; label?: string; }) => {
    // @ts-expect-error blah
    setSelectedHappiness(level);
    console.log(`Selected happiness level: ${level.level}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button name="Happiness" className="hover:bg-slate-300 text-white"><SmilePlus width={18} color="black" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border-gray-200 mr-4">
        {happinessLevels.map((level) => (
          <DropdownMenuItem 
            key={level.level} 
            onSelect={() => handleHappinessSelect(level)}
            className="cursor-pointer bg-white hover:bg-blue-500 text-black hover:text-white"
          >
            {level.emoji} {level.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HappinessSelector;