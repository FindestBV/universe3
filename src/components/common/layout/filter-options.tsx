import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Globe, Pin } from "lucide-react";

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
    <div className="mx-auto w-full max-w-md">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <h2 className="text-blank py-4 font-bold">Show connections</h2>
        <TabsList className="flex justify-center space-x-4">
          <TabsTrigger value="project" className="flex gap-2">
            <Pin className={`size-5 text-gray-600`} />
            <span> Project Only</span>
          </TabsTrigger>
          <TabsTrigger value="universe" className="flex gap-2">
            <Globe className={`size-5 text-gray-600`} />
            <span> Universe</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="project">
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
        </TabsContent>
        <TabsContent value="universe">
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
        </TabsContent>
      </Tabs>

      <button
        type="submit"
        className="max-w-[200px] rounded-md bg-black p-2 text-sm text-white hover:bg-slate-500 focus:outline-none"
        // onClick={() => setIsDialogOpen(false)}
      >
        Save Changes
      </button>
    </div>
  );
};

export default FilterOptions;
