import { currentUser, logout } from "@/api/auth/authSlice";
import { setSidebarState } from "@/api/utilities/sidebarSlice";
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
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BookOpenCheck,
  Bot,
  Calendar,
  ChevronUp,
  FileQuestion,
  FileText,
  Fingerprint,
  Inbox,
} from "lucide-react";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AdvancedSearchModal from "../dialogs/advanced-search-modal";
import GenerateReport from "../dialogs/generate-report-modal";
import UserAvatar from "../utilities/user-avatar";

export function AppSidebar() {
  const { open } = useSidebar();
  const user = useSelector(currentUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    console.log("is open", open);
    // dispatch(setSidebarState(open));
  }, [open]);

  return (
    <Sidebar collapsible="icon" className="bg-gray-900 text-white">
      {/* Sidebar Header */}
      <div className="mx-auto flex w-full items-center justify-center p-4">
        <a href="/dashboard" rel="preload">
          {open ? (
            <img
              src={logoUniverse}
              alt="Findest logo"
              className={`transition-all duration-300 ease-in-out ${open ? "h-auto w-32" : ""}`}
            />
          ) : (
            <Bot size={24} />
          )}
        </a>
      </div>

      {/* Sidebar Content */}
      <SidebarContent
        className={`mt-8 flex min-h-0 flex-1 flex-col justify-between ${open ? "p-4" : "p-2"}`}
      >
        <div className={`flex flex-col gap-8 ${open ? "items-start" : "items-center"}`}>
          {/* Inbox Menu */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Inbox">
                <a
                  href="/inbox"
                  className="group/link flex items-center gap-2 text-white hover:text-black"
                >
                  <Inbox size={18} className="text-white group-hover/link:text-black" />
                  {open && (
                    <span className="font-medium text-white group-hover/link:text-black">
                      Inbox
                    </span>
                  )}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Universe Menu */}
          <SidebarGroupLabel>
            <Bot width={18} color={"white"} />
            <h1 className="text-md ml-2 font-black">Universe</h1>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <ul
                className={`${
                  open ? "mt-4 gap-4 md:ml-6" : "ml-0 gap-4 space-y-2 pl-2 md:mt-4"
                } flex flex-col`}
              >
                <li>
                  <a
                    href="/library/documents"
                    className={`flex items-center gap-2 rounded-md text-white transition-all duration-150 hover:bg-white ${open ? "md:p-2" : ""} hover:text-black`}
                  >
                    <FileText size={16} />
                    <span className="group-data-[collapsible=icon]:hidden">Documents</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/library/entities"
                    className={`flex items-center gap-2 rounded-md text-white transition-all duration-150 hover:bg-white ${open ? "md:p-2" : ""} hover:text-black`}
                  >
                    <Fingerprint size={16} />
                    <span className="group-data-[collapsible=icon]:hidden">Entities</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/library/studies"
                    className={`flex items-center gap-2 rounded-md text-white transition-all duration-150 hover:bg-white ${open ? "md:p-2" : ""} hover:text-black`}
                  >
                    <BookOpenCheck size={16} />
                    <span className="group-data-[collapsible=icon]:hidden">Studies</span>
                  </a>
                </li>
              </ul>
            </SidebarMenu>
          </SidebarGroupContent>
          {/* Advanced Search */}
          <div className={`mb-4 mt-6 gap-6 ${!open ? "text-center" : ""}`}>
            <SidebarGroupLabel className="my-4">
              <Bot width={18} color={"white"} />
              <h1 className="text-md ml-2 font-black">
                IGOR<sup>AI</sup> search
              </h1>
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                <ul
                  className={`${
                    open ? "mt-4 gap-4 md:ml-6" : "ml-0 gap-4 space-y-2 pl-2 md:mt-4"
                  } flex flex-col`}
                >
                  <AdvancedSearchModal />
                  <li>
                    <a
                      href="/library/entities"
                      className={`flex items-center gap-2 rounded-md text-white transition-all duration-150 hover:bg-white ${open ? "md:p-2" : ""} hover:text-black`}
                    >
                      <Fingerprint size={16} />
                      <span className="group-data-[collapsible=icon]:hidden">Entities</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/library/studies"
                      className={`flex items-center gap-2 rounded-md text-white transition-all duration-150 hover:bg-white ${open ? "md:p-2" : ""} hover:text-black`}
                    >
                      <BookOpenCheck size={16} />
                      <span className="group-data-[collapsible=icon]:hidden">Studies</span>
                    </a>
                  </li>
                </ul>
              </SidebarMenu>

              <SidebarMenu>
                <SidebarMenuItem>
                  <a
                    href="/queries"
                    className="flex items-center gap-2 text-white hover:text-black"
                  >
                    <FileQuestion size={18} className="ml-2" />
                    {open && <span className="font-medium">Advanced Search</span>}
                  </a>
                </SidebarMenuItem>

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
                      className="text-white hover:text-blue-500"
                    />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </div>
        </div>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip="Profile"
              className={`${!open ? "items-center justify-center" : "items-center justify-start"} flex`}
            >
              <UserAvatar username={user} />
              {open && (
                <span className="font-medium group-data-[collapsible=icon]:hidden">Profile</span>
              )}
              <ChevronUp className="ml-auto hidden" />
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
    </Sidebar>
  );
}
