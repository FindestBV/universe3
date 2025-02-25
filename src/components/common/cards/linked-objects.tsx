/**
 * LinkedObjects Component
 *
 * This component displays a list of linked objects (e.g., users, entities, or related items)
 * with interactive tooltips and hover cards. It is primarily used to show connections
 * between different entities within the application.
 *
 * The component utilizes:
 * - **ShadCN HoverCard** for displaying additional information on hover.
 * - **Radix Tooltip** for enhanced user experience.
 * - **Avatar component** to display profile images or fallback initials.
 *
 * @component
 * @param {Object} [props] - The component props.
 * @param {Object.<string, number>} [props.linkedObjects] - A mapping of item types to their respective counts.
 * @param {string} [props.id] - Unique identifier for the entity.
 * @param {Function} [props.prefetch] - Optional function for prefetching data when hovering over an item.
 * @param {Function} [props.onItemClick] - Optional function called when an item is clicked.
 * @param {Array<Object>} [props.connectedObjects] - A list of related objects, each containing:
 *   @param {string} connectedObjects[].id - The unique ID of the related object.
 *   @param {string} connectedObjects[].name - The display name of the related object.
 *   @param {number} connectedObjects[].type - The type of the related object.
 *   @param {string} [connectedObjects[].url] - Optional URL associated with the related object.
 *
 * @example
 * <LinkedObjects
 *   linkedObjects={{ entityCount: 3, documentCount: 5 }}
 *   id="1234"
 *   prefetch={(data) => console.log("Prefetching", data)}
 *   onItemClick={(id) => console.log("Clicked", id)}
 *   connectedObjects={[{ id: "5678", name: "Study A", type: 4, url: "/study/5678" }]}
 * />
 *
 * @returns {JSX.Element} The rendered LinkedObjects component.
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { CalendarIcon } from "lucide-react";

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
