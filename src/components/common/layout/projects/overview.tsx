import ArticleTest from "@/components/common/layout/article-test";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import people from "@/lib/data/people";
import { motion } from "framer-motion";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ProjectOverView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTabActive, setIsActiveTabActive] = useState<string>("pages");
  return (
    <motion.div
      className="settings px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="min-h-screen">
        <div className="mx-auto max-w-full p-8">
          {/* Header */}
          <h1 className="text-2xl font-semibold text-gray-800">Project Overview</h1>

          <div className="mt-6">
            <h3 className="text-md my-2 font-semibold">Recent activity</h3>
            <Tabs defaultValue="pages" className="pb-4" onValueChange={setIsActiveTabActive}>
              <TabsList className="flex justify-start space-x-4 border-b border-slate-200 bg-transparent">
                <TabsTrigger
                  value="pages"
                  className={`linear p-2 text-sm transition-all duration-150 ${
                    activeTabActive === "pages"
                      ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                      : "text-gray-500"
                  }`}
                >
                  Pages
                </TabsTrigger>
                <TabsTrigger
                  value="sources"
                  className={`linear p-2 text-sm transition-all duration-150 ${
                    activeTabActive === "sources"
                      ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                      : "text-gray-500"
                  }`}
                >
                  Sources
                </TabsTrigger>
                <TabsTrigger
                  value="team"
                  className={`linear p-2 text-sm transition-all duration-150 ${
                    activeTabActive === "team"
                      ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                      : "text-gray-500"
                  }`}
                >
                  Team
                </TabsTrigger>
              </TabsList>

              {/* Activity Content */}
              <TabsContent value="pages" className="py-4 text-sm">
                Content 1
              </TabsContent>

              <TabsContent value="sources" className="py-4 text-sm">
                Content 2
              </TabsContent>

              <TabsContent value="team" className="py-4 text-sm">
                Content 3
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <ArticleTest />
    </motion.div>
  );
};

export default ProjectOverView;
