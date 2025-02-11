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
import { Circle, File, Home, Inbox, Link, Minus, Network, Plus } from "lucide-react";

import { createElement, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { SearchForm } from "./search-form";

const data = {
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Inbox", url: "/inbox", icon: Inbox },
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
      icon: Link,
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
                    className={`flex w-full items-center bg-transparent hover:bg-white ${!open ? "p-2" : "px-4 py-2"} gap-2 rounded-md transition`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center">
                      {item.icon && createElement(item.icon, { size: 20 })}
                    </span>
                    {open && <span className="text-sm">{item.title}</span>}

                    <span className="ml-auto flex items-center gap-2">
                      {item.title === "Pages" && (
                        <Network className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-gray-200" />
                      )}
                      {openSections[item.title] ? (
                        <Minus className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-gray-200" />
                      ) : (
                        <Plus className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-gray-200" />
                      )}
                    </span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent className="pl-0">
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem
                        key={subItem.title}
                        className="border-l border-neutral-200 pl-2 hover:bg-transparent"
                      >
                        <SidebarMenuSubButton asChild>
                          <a
                            href={subItem.url}
                            className={`block bg-transparent px-4 py-2 text-sm transition ${
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
                className={`flex w-full items-center ${!open ? "p-2" : "px-4 py-2"} gap-2 rounded-md transition`}
                onClick={() => {
                  setOpen(true);
                  setAutoClosed(false);
                }}
              >
                <span className="flex h-6 w-6 items-center justify-center group-hover:bg-gray-100">
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
