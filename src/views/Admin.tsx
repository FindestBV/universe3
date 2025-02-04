import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import people from "@/lib/data/people";
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
          <Tabs defaultValue="users" className="py-4">
            <TabsList className="flex justify-start space-x-4 bg-transparent">
              <TabsTrigger value="users" className="px-4 py-2">
                Users
              </TabsTrigger>

              <TabsTrigger value="switch" className="px-4 py-2">
                Switch Tenant
              </TabsTrigger>

              <TabsTrigger value="security" className="px-4 py-2">
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="py-4">
              <ul role="list" className="divide-y divide-gray-100">
                {people.map((person) => (
                  <li key={person.email} className="flex justify-between gap-x-6 py-5">
                    <div className="flex min-w-0 gap-x-4">
                      <img
                        alt=""
                        src={person.imageUrl}
                        className="size-12 flex-none rounded-full bg-gray-50"
                      />
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm/6 font-semibold text-gray-900">{person.name}</p>
                        <p className="mt-1 truncate text-xs/5 text-gray-500">{person.email}</p>
                      </div>
                    </div>
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                      <p className="text-sm/6 text-gray-900">{person.role}</p>
                      {person.lastSeen ? (
                        <p className="mt-1 text-xs/5 text-gray-500">
                          Last seen{" "}
                          <time dateTime={person.lastSeenDateTime}>{person.lastSeen}</time>
                        </p>
                      ) : (
                        <div className="mt-1 flex items-center gap-x-1.5">
                          <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                            <div className="size-1.5 rounded-full bg-emerald-500" />
                          </div>
                          <p className="text-xs/5 text-gray-500">Online</p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="switch" className="py-4">
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
