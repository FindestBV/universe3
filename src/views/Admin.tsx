import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

import { useLocation, useNavigate } from "react-router-dom";

export const Admin = () => {
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

          <h1 className="text-2xl font-semibold text-gray-800">Galaxy Admin</h1>
          <p className="text-sm text-gray-500">Manage account settings for your tenant galaxies</p>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="py-4">
            <TabsList className="flex justify-start space-x-4 bg-transparent">
              <TabsTrigger value="profile" className="px-4 py-2">
                Profile
              </TabsTrigger>
              <TabsTrigger value="account" className="px-4 py-2">
                Account
              </TabsTrigger>
              <TabsTrigger value="security" className="px-4 py-2">
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="py-4">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-md border px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-md border px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </form>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="py-4">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="mt-1 block w-full rounded-md border px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </form>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="py-4">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="mt-1 block w-full rounded-md border px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default Admin;
