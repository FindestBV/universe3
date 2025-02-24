import { currentUser } from "@/api/auth/authSlice";
import { NavMain } from "@/components/common/sidebar/v2/nav-main";
import UserAvatar from "@/components/common/utilities/user-avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Circle, File, Globe, Link, SquareTerminal } from "lucide-react";

import * as React from "react";
import { useSelector } from "react-redux";

// This is sample data.
const data = {
  user: {
    name: "Ronan O'Leary",
    email: "ronan.oleary@findest.eu",
    avatar: "/assets/images/ro-bw.d434f415.png",
  },

  navMain: [
    {
      title: "Inbox",
      url: "#",
      icon: SquareTerminal,
    },
    {
      title: "Projects",
      url: "#",
      icon: Circle,
      isActive: false,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Pages",
      url: "#",
      icon: File,
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
      title: "Search",
      url: "#",
      icon: Link,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};

function SidebarToggle({ sidebarState }: string) {
  const { toggleSidebar } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          onClick={toggleSidebar}
          className="w-full items-center justify-start gap-1 hover:bg-none"
        >
          <div className="mt-1 flex aspect-square size-8 items-center justify-center rounded-lg">
            <Globe className={`size-5 ${sidebarState ? "text-slate-600" : "text-white"}`} />
          </div>
          <div className={`text-slate-700" mt-1 grid flex-1 text-left text-lg`}>
            <span className="truncate font-semibold">Universe</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar({ isOpen, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  const sidebarState = isOpen ?? open;
  const user = useSelector(currentUser); // Get user from Redux

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className={`mainSidebar ${sidebarState ? "bg-white" : "bg-[#757575]"}`}
    >
      <SidebarHeader sidebarState={sidebarState}>
        <SidebarToggle />
      </SidebarHeader>
      <SidebarContent className="mt-9">
        <NavMain items={data.navMain} sidebarState={sidebarState} />
      </SidebarContent>
      <SidebarFooter className="sidebarFooter">
        {/* <NavUser user={data.user} /> */}
        <UserAvatar username={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
