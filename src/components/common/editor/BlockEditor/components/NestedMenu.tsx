import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { GraphNode } from "@/types/types";
import { ChevronDown, ChevronRight, Circle } from "lucide-react";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  label: string;
  children?: MenuItem[];
  id?: string;
  objectType?: number;
}

interface MenuItemProps {
  item: MenuItem;
  level?: number;
}

interface NestedMenuProps {
  projectStructure?: GraphNode[];
}

const MenuItemComponent: React.FC<MenuItemProps> = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.id && item.objectType) {
      if (item.objectType === 4) {
        navigate(`/pages/studies/${item.id}`);
      } else if (item.objectType === 1) {
        navigate(`/pages/entities/${item.id}`);
      }
    }
  };

  return (
    <li className="relative">
      {level > 0 && <div className="absolute left-[-20px] top-0 h-full w-[2px] bg-gray-200" />}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          className="relative flex w-full items-center gap-1 rounded-md py-2 transition-colors hover:bg-black hover:text-white"
          onClick={handleClick}
        >
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
        {hasChildren && item.children && (
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

export const NestedMenu: React.FC<NestedMenuProps> = ({ projectStructure = [] }) => {
  // Convert GraphNode[] to MenuItem[]
  const convertGraphNodeToMenuItem = (node: GraphNode): MenuItem => {
    const children: MenuItem[] = [
      ...(node.lowerLevelNodes || []).map(convertGraphNodeToMenuItem),
      ...(node.otherUpperLevelNodes || []).map(convertGraphNodeToMenuItem),
    ];

    return {
      label: `${node.name}${node.customTypeName ? ` (${node.customTypeName})` : ""}`,
      children: children.length > 0 ? children : undefined,
      id: node.id,
      objectType: node.objectType,
    };
  };

  const menuItems: MenuItem[] = projectStructure.map(convertGraphNodeToMenuItem);

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
