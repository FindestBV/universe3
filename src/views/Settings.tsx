import { currentUser, userEmail } from "@/api/auth/authSlice";
import ArticleTest from "@/components/shared/layout/article-test";
import BentoGrid from "@/components/shared/layout/bento-grid";
import ImageTiles from "@/components/shared/layout/image-tiles";
import LanguageSelector from "@/components/shared/layout/language-selector";
import ProfileCardTest from "@/components/shared/layout/profile-card-test";
import Settings from "@/components/shared/user/settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector(currentUser);
  const mail = useSelector(userEmail);

  console.log("user", user);
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
      <ArticleTest />
      <div className="min-h-screen">
        <div className="mx-auto max-w-full p-8">
          {/* Header */}

          <h1 className="text-2xl font-semibold text-gray-800">User Settings</h1>
          <p className="text-sm text-gray-500">Manage your account settings</p>

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
              <Settings user={user} />
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={user}
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
                    value={mail}
                    className="mt-1 block w-full rounded-md border px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    className="mb-4 block text-sm font-medium text-gray-700"
                    htmlFor="Select Language"
                  >
                    Select Language
                  </label>
                  <LanguageSelector />
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

          <BentoGrid />
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
