import ProjectsUniverseSwitch from "@/components/common/utilities/projects-universe-switch";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { FilterIcon, Globe, Pin } from "lucide-react";

import { useState } from "react";

const filters = [
  { category: "Type", options: ["Science", "Patents", "Websites"] },
  { category: "Connection Type", options: ["Pages", "Highlights", "Images", "Attachments"] },
  { category: "Is Open Access?", options: ["Yes", "No"] },
];

export const FilterOptions = () => {
  const [selectedTab, setSelectedTab] = useState("project");
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleFilterChange = (category, option) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: { ...prev[category], [option]: !prev[category]?.[option] },
    }));
  };

  return (
    <div className="max-w-m fixed mx-auto h-screen w-full">
      <div className="mb-6 mt-6 flex gap-4">
        <FilterIcon className="fill-black" /> <h2 className="text-sm font-bold">Filter options </h2>
      </div>

      <div>
        <h2 className="text-blank py-4 font-bold">Show connections</h2>

        <div>
          <Card>
            <CardContent className="flex flex-col gap-12 py-4">
              {filters.map(({ category, options }) => (
                <div key={category} className="flex flex-col gap-4">
                  <h4 className="mb-2 text-lg font-semibold">{category}</h4>
                  {options.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <Checkbox
                        id={`${category}-${option}`}
                        checked={selectedFilters[category]?.[option] || false}
                        onCheckedChange={() => handleFilterChange(category, option)}
                      />
                      <Label htmlFor={`${category}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <button
        type="submit"
        className="max-w-[200px] rounded-md bg-black p-2 text-sm text-white hover:bg-slate-500 focus:outline-none"
      >
        Save Changes
      </button>
    </div>
  );
};

export default FilterOptions;
