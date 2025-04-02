import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import React, { useState } from "react";

interface FilterOptionsProps {
  onSave: (filters: Record<string, any>) => void;
}

export const FilterOptions = ({ onSave }: FilterOptionsProps) => {
  const [filters, setFilters] = useState<Record<string, any>>({
    type: [],
    connectionType: [],
    isOpenAccess: undefined,
  });

  const handleSaveChanges = () => {
    onSave(filters);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="text-lg font-semibold">Filter options</h2>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto">
        {/* Type filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Type</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="science"
                checked={filters.type.includes("science")}
                onCheckedChange={(checked) => {
                  setFilters((prev) => ({
                    ...prev,
                    type: checked
                      ? [...prev.type, "science"]
                      : prev.type.filter((t) => t !== "science"),
                  }));
                }}
              />
              <Label htmlFor="science" className="text-sm text-slate-600">
                Science
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="patents"
                checked={filters.type.includes("patents")}
                onCheckedChange={(checked) => {
                  setFilters((prev) => ({
                    ...prev,
                    type: checked
                      ? [...prev.type, "patents"]
                      : prev.type.filter((t) => t !== "patents"),
                  }));
                }}
              />
              <Label htmlFor="patents" className="text-sm text-slate-600">
                Patents
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="websites"
                checked={filters.type.includes("websites")}
                onCheckedChange={(checked) => {
                  setFilters((prev) => ({
                    ...prev,
                    type: checked
                      ? [...prev.type, "websites"]
                      : prev.type.filter((t) => t !== "websites"),
                  }));
                }}
              />
              <Label htmlFor="websites" className="text-sm text-slate-600">
                Websites
              </Label>
            </div>
          </div>
        </div>

        {/* Connection Type filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Connection Type</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pages"
                checked={filters.connectionType.includes("pages")}
                onCheckedChange={(checked) => {
                  setFilters((prev) => ({
                    ...prev,
                    connectionType: checked
                      ? [...prev.connectionType, "pages"]
                      : prev.connectionType.filter((t) => t !== "pages"),
                  }));
                }}
              />
              <Label htmlFor="pages" className="text-sm text-slate-600">
                Pages
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="highlights"
                checked={filters.connectionType.includes("highlights")}
                onCheckedChange={(checked) => {
                  setFilters((prev) => ({
                    ...prev,
                    connectionType: checked
                      ? [...prev.connectionType, "highlights"]
                      : prev.connectionType.filter((t) => t !== "highlights"),
                  }));
                }}
              />
              <Label htmlFor="highlights" className="text-sm text-slate-600">
                Highlights
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="images"
                checked={filters.connectionType.includes("images")}
                onCheckedChange={(checked) => {
                  setFilters((prev) => ({
                    ...prev,
                    connectionType: checked
                      ? [...prev.connectionType, "images"]
                      : prev.connectionType.filter((t) => t !== "images"),
                  }));
                }}
              />
              <Label htmlFor="images" className="text-sm text-slate-600">
                Images
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="attachments"
                checked={filters.connectionType.includes("attachments")}
                onCheckedChange={(checked) => {
                  setFilters((prev) => ({
                    ...prev,
                    connectionType: checked
                      ? [...prev.connectionType, "attachments"]
                      : prev.connectionType.filter((t) => t !== "attachments"),
                  }));
                }}
              />
              <Label htmlFor="attachments" className="text-sm text-slate-600">
                Attachments
              </Label>
            </div>
          </div>
        </div>

        {/* Is Open Access filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Is Open Access?</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="openAccess"
                checked={filters.isOpenAccess === true}
                onCheckedChange={(checked) => {
                  setFilters((prev) => ({
                    ...prev,
                    isOpenAccess: checked ? true : undefined,
                  }));
                }}
              />
              <Label htmlFor="openAccess" className="text-sm text-slate-600">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notOpenAccess"
                checked={filters.isOpenAccess === false}
                onCheckedChange={(checked) => {
                  setFilters((prev) => ({
                    ...prev,
                    isOpenAccess: checked ? false : undefined,
                  }));
                }}
              />
              <Label htmlFor="notOpenAccess" className="text-sm text-slate-600">
                No
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-4">
        <Button
          onClick={handleSaveChanges}
          className="w-full bg-black text-white hover:bg-black/90"
        >
          Save changes
        </Button>
      </div>
    </div>
  );
};
