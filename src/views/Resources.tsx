import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

import { useLocation, useNavigate } from "react-router-dom";

export const Resources = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const viewOptions = {
    "RELATIONS GRAPH": "link",
    "PAGE TYPE BREAKDOWN": "pack",
  };

  const optionLabels = Object.keys(viewOptions);

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

          <h1 className="text-2xl font-semibold text-gray-800">Universe Resources</h1>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="py-4">
            <TabsList className="flex justify-start space-x-4 bg-transparent">
              <TabsTrigger value="profile" className="px-4 py-2">
                Documentation
              </TabsTrigger>
              <TabsTrigger value="account" className="px-4 py-2">
                Quick Tips
              </TabsTrigger>
              <TabsTrigger value="security" className="px-4 py-2">
                Tutorials
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="py-4">
              <p>Link to docs</p>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="py-4">
              <p>Link to tips</p>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="py-4">
              <p>Link to videos/tutorials</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default Resources;
