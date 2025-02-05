import * as React from "react";

import { Checkbox } from "./checkbox";
import { FormControl, FormItem, FormLabel } from "./form";

interface CheckboxGroupItem {
  id: string;
  label: string;
}

interface CheckboxGroupProps {
  items: CheckboxGroupItem[];
  value?: string[];
  onChange?: (value: string[]) => void;
}

export function CheckboxGroup({ items, value = [], onChange }: CheckboxGroupProps) {
  const [selectedItems, setSelectedItems] = React.useState<string[]>(value);

  const handleCheckboxChange = (itemId: string) => {
    const updatedItems = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId];

    setSelectedItems(updatedItems);
    onChange?.(updatedItems);
  };

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={selectedItems.includes(item.id)}
              onCheckedChange={() => handleCheckboxChange(item.id)}
            />
          </FormControl>
          <FormLabel className="font-normal">{item.label}</FormLabel>
        </FormItem>
      ))}
    </div>
  );
}
