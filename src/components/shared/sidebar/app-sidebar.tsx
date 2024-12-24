"use client";

import { currentUser, logout } from "@/api/auth/authSlice";
import faviconUniverse from "@/assets/favicon.ico";
import logoUniverse from "@/assets/universe_logo_white.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useNavigateWithTransition } from "@/hooks/use-navigate-with-transition";
import {
  BookOpenCheck,
  Bot,
  Calendar,
  ChevronUp,
  FileText,
  Fingerprint,
  Inbox,
  Settings,
  UserRoundIcon as UserRoundPen,
} from "lucide-react";

import { useState } from "react";
import { useSelector } from "react-redux";

import AdvancedSearchModal from "../modals/advanced-search-modal";
import GenerateReport from "../modals/generate-report-modal";

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigateWithTransition = useNavigateWithTransition();
  const user = useSelector(currentUser);

  const handleToggleSidebar = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  const handleLogout = () => {
    console.log("Log out");
  };

  return (
    <Sidebar
      collapsible="icon"
      onToggle={(collapsed) => handleToggleSidebar(collapsed)}
      className="bg-gray-900 text-white"
    >
      {/* Sidebar Header */}
      <div className="mx-auto flex w-full items-center justify-center p-4">
        <a href="/dashboard" rel="preload">
          <img
            src={isCollapsed ? faviconUniverse : logoUniverse}
            alt="Findest logo"
            className={`transition-all duration-300 ease-in-out ${
              isCollapsed ? "h-8 w-8" : "h-auto w-32"
            }`}
          />
        </a>
      </div>

      {/* Sidebar Content */}
      <SidebarContent className="flex flex-col justify-between p-4">
        <div className="gap-4 space-y-6">
          {/* Inbox Menu */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Inbox">
                <a href="/inbox" className="flex items-center gap-2">
                  <Inbox
                    size={18}
                    className="text-white group-data-[collapsible=icon]:text-white"
                  />
                  <span className="font-medium group-data-[collapsible=icon]:hidden">Inbox</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Universe Menu */}
          <SidebarMenu>
            {!isCollapsed && (
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Universe">
                  <div className="flex items-center gap-2">
                    <Calendar
                      size={18}
                      className="text-white group-data-[collapsible=icon]:text-white"
                    />
                    <span className="font-medium group-data-[collapsible=icon]:hidden">
                      Universe
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <ul className="ml-6 mt-2 space-y-2 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:space-y-0">
              <li>
                <a
                  href="/library/documents"
                  className="flex items-center gap-2 text-white hover:text-blue-500"
                >
                  <FileText size={16} />
                  <span className="group-data-[collapsible=icon]:hidden">Documents</span>
                </a>
              </li>
              <li>
                <a
                  href="/library/entities"
                  className="flex items-center gap-2 text-white hover:text-blue-500"
                >
                  <Fingerprint size={16} />
                  <span className="group-data-[collapsible=icon]:hidden">Entities</span>
                </a>
              </li>
              <li>
                <a
                  href="/library/studies"
                  className="flex items-center gap-2 text-white hover:text-blue-500"
                >
                  <BookOpenCheck size={16} />
                  <span className="group-data-[collapsible=icon]:hidden">Studies</span>
                </a>
              </li>
            </ul>
          </SidebarMenu>

          {/* Advanced Search */}
          <SidebarGroupLabel className="mb-4 mt-6 flex items-center gap-2">
            <Bot size={18} className="text-white group-data-[collapsible=icon]:text-white" />
            <h1 className="text-md font-black group-data-[collapsible=icon]:hidden">
              IGOR<sup>AI</sup>search
            </h1>
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <AdvancedSearchModal />
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <GenerateReport
                  leftContent={"Left"}
                  rightContent={"Right"}
                  className="text-white hover:text-blue-500 group-data-[collapsible=icon]:hidden"
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        {/* Sidebar Footer */}
        <SidebarFooter className="p-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                tooltip="Profile"
                className="group-data-[collapsible=icon]:justify-center"
              >
                <UserRoundPen
                  size={18}
                  className="text-white group-data-[collapsible=icon]:text-white"
                />
                <span className="font-medium group-data-[collapsible=icon]:hidden">Profile</span>
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width] bg-gray-800 text-white"
            >
              <DropdownMenuItem>
                <a href="/inbox">{user ? `${user}'s` : ""} Inbox</a>
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem>
                <a href="/resources">Resources</a>
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem>
                <a href="/admin">Admin</a>
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem>
                <a href="/user/settings">Settings</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#" onClick={handleLogout}>
                  Log Out
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </SidebarContent>

      {/* Sidebar Rail */}
      <SidebarRail />
    </Sidebar>
  );
}
