import { NavMain } from "@/components/common/sidebar/v2/nav-main";
import { NavUser } from "@/components/common/sidebar/v2/nav-user";
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
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Circle,
  Command,
  File,
  Frame,
  GalleryVerticalEnd,
  Globe,
  Link,
  SquareTerminal,
} from "lucide-react";

import * as React from "react";
import { useEffect, useState } from "react";

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
      title: "Sources",
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

function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          onClick={toggleSidebar}
          className="w-full justify-start gap-2 hover:bg-none"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
            <Globe className="size-6 text-slate-600" />
          </div>
          <div className="grid flex-1 text-left text-lg text-slate-700">
            <span className="truncate font-semibold">Universe</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar({ isOpen, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar(); // Directly use `open` from useSidebar()
  const sidebarState = isOpen ?? open;
  console.log("🔍 Sidebar state from useSidebar():", open); // Debugging logs

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className={`border-r border-gray-200 transition-all duration-150 ${
        sidebarState ? "bg-white" : "bg-gray-800"
      }`}
    >
      <SidebarHeader>
        <SidebarToggle />
      </SidebarHeader>
      <SidebarContent className="mt-8">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="text-slate-500">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
