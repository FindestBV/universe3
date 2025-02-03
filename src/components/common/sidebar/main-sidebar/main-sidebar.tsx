import { currentUser, logout } from "@/api/auth/authSlice";
import { useGetStudyByIdQuery } from "@/api/documents/documentApi";
import AdvancedSearchModal from "@/components/common/dialogs/advanced-search-modal";
import UserAvatar from "@/components/common/utilities/user-avatar";
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
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  AudioWaveform,
  ChevronUp,
  Command,
  GalleryVerticalEnd,
  MessageCircleQuestion,
  Search,
  SquareTerminal,
} from "lucide-react";

import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { NavMain } from "../main-sidebar/nav-main";
import { NavProjects } from "../main-sidebar/nav-projects";
import { TeamSwitcher } from "../main-sidebar/team-switcher";

const data = {
  user: {
    name: "roleary",
    email: "ronan.oleary@findest.eu",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "UNIVERSE",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Findest.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Universe",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Home",
          url: "/dashboard",
        },
        {
          title: "Sources",
          url: "/sources",
        },
        {
          title: "Pages",
          url: "/pages",
          items: [
            {
              title: "Entities",
              url: "/pages/entities",
            },
            {
              title: "Studies",
              url: "/pages/studies",
            },
          ],
        },
        {
          title: "My Workspace",
          url: "/inbox",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Advanced Search",
      url: "/queries",
      icon: Search,
    },
    {
      name: "Q & A",
      component: <AdvancedSearchModal />,
      icon: MessageCircleQuestion,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  const user = useSelector(currentUser);
  const dispatch = useDispatch();
  const { isEditing, documentId } = useSelector((state: RootState) => state.document);

  const { data: fetchedStudy, isLoading: fetchedStudyIsLoading } = useGetStudyByIdQuery(
    documentId,
    {
      refetchOnMountOrArgChange: false,
    },
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    console.log("is open", open);
  }, [open]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* ✅ Updated NavMain component to include the new "Studies" & "Navigation" sub-menu items */}
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
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
      <SidebarRail />
    </Sidebar>
  );
}
