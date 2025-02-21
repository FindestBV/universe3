import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HappinessSelector = () => {
  // Happiness levels with corresponding emojis
  const happinessLevels = [
    { level: 5, emoji: "😄", label: "Very Happy" },
    { level: 4, emoji: "🙂", label: "Happy" },
    { level: 3, emoji: "😐", label: "Neutral" },
    { level: 2, emoji: "🙁", label: "Sad" },
    { level: 1, emoji: "😢", label: "Very Sad" },
  ];

  const handleHappinessSelect = (level: { level: any; emoji?: string; label?: string }) => {
    // @ts-expect-error blah
    setSelectedHappiness(level);
    console.log(`Selected happiness level: ${level.level}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button name="Happiness" className="h-auto p-0 text-white hover:bg-slate-400">
          <img
            src="https://pendo-eu-static-5039704319590400.storage.googleapis.com/_4TtT8pHBjAa_iSMSCg6AYM1EWE/guide-media-726e985d-0f53-4bd4-b72f-3f5f5b77c8ab"
            className="h-[40px] object-cover p-[2px]"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4 border-gray-200 bg-white">
        {happinessLevels.map((level) => (
          <DropdownMenuItem
            key={level.level}
            onSelect={() => handleHappinessSelect(level)}
            className="cursor-pointer bg-white text-black hover:bg-blue-500 hover:text-white"
          >
            {level.emoji} {level.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HappinessSelector;
