import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Circle } from "lucide-react";

import React, { useState } from "react";

interface MenuItem {
  label: string;
  children?: MenuItem[];
}

interface MenuItemProps {
  item: MenuItem;
  level?: number;
}

const MenuItemComponent: React.FC<MenuItemProps> = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li className="relative">
      {level > 0 && <div className="absolute left-[-20px] top-0 h-full w-[2px] bg-gray-200" />}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="relative flex w-full items-center gap-1 rounded-md py-2 transition-colors hover:bg-black hover:text-white">
          {level > 0 && (
            <div className="absolute left-[-20px] top-1/2 h-[2px] w-[20px] bg-gray-200" />
          )}
          <div className="rounded-full p-1 transition-colors">
            {hasChildren ? (
              isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <Circle className="h-2 w-2 fill-current" />
            )}
          </div>
          <span className="text-sm font-medium">{item.label}</span>
        </CollapsibleTrigger>
        {hasChildren && (
          <CollapsibleContent>
            <ul className="relative ml-6">
              {item.children.map((child, index) => (
                <MenuItemComponent key={`${child.label}-${index}`} item={child} level={level + 1} />
              ))}
            </ul>
          </CollapsibleContent>
        )}
      </Collapsible>
    </li>
  );
};

export const NestedMenu: React.FC = () => {
  const menuItems: MenuItem[] = [
    {
      label: "Carbon Capture Overview",
      children: [
        { label: "Introduction to Carbon Capture" },
        { label: "Historical Development" },
        {
          label: "Types of Carbon Capture",
          children: [{ label: "Post-combustion Capture" }, { label: "Oxy-fuel Combustion" }],
        },
      ],
    },
    {
      label: "Direct Air Capture (DAC)",
      children: [
        { label: "DAC Technology Fundamentals" },
        { label: "Current DAC Projects" },
        {
          label: "DAC Methods",
          children: [
            { label: "Liquid Solvent Systems" },
            { label: "Solid Sorbent Systems" },
            { label: "Membrane Separation" },
          ],
        },
      ],
    },
    {
      label: "Carbon Storage",
      children: [{ label: "Ocean Storage" }, { label: "Mineral Carbonation" }],
    },
    {
      label: "Environmental Impact",
      children: [
        { label: "Ecological Considerations" },
        { label: "Carbon Footprint Analysis" },
        {
          label: "Risk Assessment",
          children: [
            { label: "Leakage Risks" },
            { label: "Monitoring Methods" },
            { label: "Safety Protocols" },
          ],
        },
      ],
    },
  ];

  return (
    <div className="w-full">
      <ul className="space-y-1">
        {menuItems.map((item, index) => (
          <MenuItemComponent key={`${item.label}-${index}`} item={item} />
        ))}
      </ul>
    </div>
  );
};

export default NestedMenu;
