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

import { useLocation, useNavigate } from "react-router-dom";

export const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

            {/* Users List */}
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
                        <p className="text-sm font-semibold text-gray-900">{person.name}</p>
                        <p className="mt-1 truncate text-xs text-gray-500">{person.email}</p>
                      </div>
                    </div>
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                      <p className="text-sm text-gray-900">{person.role}</p>
                      {person.lastSeen ? (
                        <p className="mt-1 text-xs text-gray-500">
                          Last seen{" "}
                          <time dateTime={person.lastSeenDateTime}>{person.lastSeen}</time>
                        </p>
                      ) : (
                        <div className="mt-1 flex items-center gap-x-1.5">
                          <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                            <div className="size-1.5 rounded-full bg-emerald-500" />
                          </div>
                          <p className="text-xs text-gray-500">Online</p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>

            {/* Instance & User Permissions */}
            <TabsContent value="switch" className="py-4">
              <Card>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="rounded bg-white p-1 text-gray-800" htmlFor="instance">
                      Select Instance
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue className="bg-white" placeholder="Choose an instance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instance1">One Findest</SelectItem>
                        <SelectItem value="instance2">
                          Danger Ro's House of Digital Abbominations
                        </SelectItem>
                        <SelectItem value="instance3">The Poolman Company</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="rounded bg-white p-1 text-gray-800" htmlFor="role">
                      Assign User Role
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue className="bg-white" placeholder="Choose a role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="custom">Custom Role</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button>Apply Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="py-4">
              <Card>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-2 rounded p-1 text-gray-800" htmlFor="password">
                      New Password
                    </Label>
                    <br />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter new password"
                      className="bg-white"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="mb-2 rounded p-1 text-gray-800">
                      Enable Two-Factor Authentication
                    </Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="mb-2 rounded p-1 text-gray-800">Force User 2FA</Label>
                    <Switch />
                  </div>
                  <div>
                    <Label className="mb-2 rounded p-1 text-gray-800" htmlFor="session-timeout">
                      Session Timeout (mins)
                    </Label>
                    <br />
                    <Input
                      id="session-timeout"
                      type="number"
                      placeholder="Enter timeout"
                      className="bg-white"
                    />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default Admin;
