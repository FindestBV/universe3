import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useSidebar } from "@/components/ui/sidebar";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Circle, File, Minus, Network, Plus, Settings2, SquareTerminal } from "lucide-react";

import { createElement, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { SearchForm } from "../main-sidebar/search-form";

const data = {
  navMain: [
    { title: "Inbox", url: "/inbox", icon: SquareTerminal },
    {
      title: "Projects",
      url: "/queries",
      icon: Circle,
      items: [{ title: "Entities", url: "/pages/entities" }],
    },
    {
      title: "Pages",
      url: "/pages",
      icon: File,
      items: [
        { title: "Entities", url: "/pages/entities" },
        { title: "Studies", url: "/pages/studies" },
      ],
    },
    {
      title: "Sources",
      url: "/sources",
      icon: Settings2,
      items: [{ title: "Studies", url: "/pages/studies" }],
    },
  ],
};

export function NavMain() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const [autoClosed, setAutoClosed] = useState(false);

  useEffect(() => {
    if (!autoClosed && location.pathname.match(/^\/pages\/(entities|studies)\/[^/]+$/)) {
      setOpen(false);
      setAutoClosed(true);
    }
  }, [location.pathname, setOpen, autoClosed]);

  useEffect(() => {
    const storedState = localStorage.getItem("sidebarMenuState");
    if (storedState) {
      setOpenSections(JSON.parse(storedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarMenuState", JSON.stringify(openSections));
  }, [openSections]);

  const currentPath = location.pathname;

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <SidebarGroup className="w-full">
      {open && (
        <div>
          <SearchForm />
        </div>
      )}

      <SidebarMenu className="w-full">
        {data.navMain.map((item) => {
          const isActive = item.items?.some((subItem) => subItem.url === currentPath);

          return item.items ? (
            <Collapsible
              key={item.title}
              defaultOpen={openSections[item.title] || isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem className="text-lg text-black">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    onClick={() => {
                      setOpen(true);
                      setAutoClosed(false);
                      toggleSection(item.title);
                    }}
                    className={`flex w-full items-center ${!open ? "p-2" : "px-4 py-2"} gap-2 rounded-md transition hover:bg-gray-100`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center">
                      {item.icon && createElement(item.icon, { size: 20 })}
                    </span>
                    {open && <span className="text-sm">{item.title}</span>}

                    {/* Pages-specific UI with Network icon always visible */}
                    {item.title === "Pages" ? (
                      <span className="ml-auto flex items-center gap-2">
                        <Network className="h-4 w-4 text-gray-600" />
                        {openSections[item.title] ? (
                          <Minus className="text-gray-600" />
                        ) : (
                          <Plus className="text-gray-600" />
                        )}
                      </span>
                    ) : (
                      <span className="ml-auto flex items-center">
                        <Plus className="hidden group-data-[state=closed]/collapsible:block" />
                        <Minus className="hidden group-data-[state=open]/collapsible:block" />
                      </span>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent className="pl-0">
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title} className="pl-4">
                        <SidebarMenuSubButton asChild>
                          <a
                            href={subItem.url}
                            className={`block px-4 py-2 text-sm transition ${
                              currentPath === subItem.url ? "text-slate-700" : "text-slate-600"
                            }`}
                          >
                            {subItem.title}
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title} className="text-black">
              <a
                href={item.url}
                className={`flex w-full items-center ${!open ? "p-2" : "px-4 py-2"} gap-2 rounded-md transition hover:bg-gray-100`}
                onClick={() => {
                  setOpen(true);
                  setAutoClosed(false);
                }}
              >
                <span className="flex h-6 w-6 items-center justify-center">
                  {item.icon && createElement(item.icon, { size: 20 })}
                </span>
                {open && <span className="text-sm">{item.title}</span>}
              </a>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
