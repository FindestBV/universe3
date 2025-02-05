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
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import * as React from "react";

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
      icon: Settings2,
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
        <SidebarMenuButton size="lg" onClick={toggleSidebar} className="w-full justify-start">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
            <Globe className="size-5 text-slate-600" />
          </div>
          <div className="grid flex-1 text-left text-lg leading-tight text-slate-600">
            <span className="truncate font-semibold">Universe</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="bg-[#f9f9f9]">
      <SidebarHeader>
        <SidebarToggle />
      </SidebarHeader>
      <SidebarContent className="mt-10">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="text-slate-500">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
