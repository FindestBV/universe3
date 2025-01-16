import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { BookOpenCheck, Fingerprint, Highlighter, Image, Paperclip } from "lucide-react";
import { CalendarIcon } from "lucide-react";

// // Icons for types
// const typeIcons = {
//   documentCount: BookOpenCheck,
//   studyCount: BookOpenCheck,
//   entityCount: Fingerprint,
//   imageCount: Image,
//   fileCount: Paperclip,
//   highlightCount: Highlighter,
// };

// // Mapping LinkedObjects keys to tObjectTypeEnum values
// const objectTypeMapping: { [key: string]: number } = {
//   entityCount: 1,
//   documentCount: 2,
//   highlightCount: 3,
//   studyCount: 4,
//   imageCount: 5,
//   scienceArticleCount: 6,
//   usPatentCount: 7,
//   weblinkCount: 8,
//   magPatentCount: 9,
//   commentCount: 10,
//   fileCount: 11,
//   tenantCount: 12,
//   organizationCount: 13,
//   caseCount: 14,
//   queryCount: 15,
// };

interface LinkedObjectsProps {
  linkedObjects?: { [key: string]: number };
  id?: string;
  prefetch?: (args: { id: string; type: number }) => void;
  onItemClick?: (id: string) => void;
  connectedObjects?: { id: string; name: string; type: number; url?: string }[];
}

export const LinkedObjects: React.FC<LinkedObjectsProps> = () => {
  return (
    <ul className="linkedObjects flex flex-row gap-2">
      <li>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" className="text-black">
              @nextjs
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <Avatar>
                <AvatarImage src="https://github.com/vercel.png" />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">@nextjs</h4>
                <p className="text-sm">The React Framework – created and maintained by @vercel.</p>
                <div className="flex items-center pt-2">
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                  <span className="text-xs text-muted-foreground">Joined December 2021</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </li>
      <li>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" className="text-black">
              @dangerRo
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <Avatar>
                <AvatarImage src="https://github.com/vercel.png" />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">@dangerRo</h4>
                <p className="text-sm">Ronan is an idiot.</p>
                <div className="flex items-center pt-2">
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                  <span className="text-xs text-muted-foreground">Joined Janaury 2025</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </li>
    </ul>
  );
};

export default LinkedObjects;
