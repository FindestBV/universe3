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
import { Circle, File, Minus, Plus, Settings2, SquareTerminal } from "lucide-react";

import { createElement, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { SearchForm } from "../main-sidebar/search-form";

// Sidebar navigation structure
const data = {
  navMain: [
    { title: "Inbox", url: "/inbox", icon: SquareTerminal },
    { title: "Projects", url: "/queries", icon: Circle },
    {
      title: "Pages",
      url: "/pages",
      icon: File,
      items: [
        { title: "Entities", url: "/pages/entities" },
        { title: "Studies", url: "/pages/studies" },
      ],
    },
    { title: "Sources", url: "/sources", icon: Settings2 },
  ],
};

export function NavMain() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const { open, setOpen } = useSidebar(); // Get sidebar open/close state
  const location = useLocation();

  // ✅ Track if the sidebar has been auto-closed to prevent repeated closures
  const [autoClosed, setAutoClosed] = useState(false);

  useEffect(() => {
    // ✅ Close sidebar only if it hasn't been closed before
    if (!autoClosed && location.pathname.match(/^\/pages\/(entities|studies)\/[^/]+$/)) {
      setOpen(false); // Close sidebar
      setAutoClosed(true); // Mark it as auto-closed
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
      {/* ✅ Search form only visible when sidebar is open */}
      {open && (
        <div className="mb-12">
          <SearchForm />
        </div>
      )}

      <SidebarMenu className="w-full">
        {data.navMain.map((item) => {
          const isActive = item.items?.some((subItem) => subItem.url === currentPath);

          return item.items ? (
            // ✅ Collapsible remains intact for menu sections with sub-items
            <Collapsible
              key={item.title}
              defaultOpen={openSections[item.title] || isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem className="text-lg text-slate-500">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    onClick={() => {
                      setOpen(true); // ✅ Allow manual toggling back open
                      setAutoClosed(false); // ✅ Reset auto-close tracking
                      toggleSection(item.title);
                    }}
                    className={`flex w-full items-center ${!open ? "p-2" : "px-4 py-2"} gap-2 rounded-md transition hover:bg-gray-100`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center">
                      {item.icon && createElement(item.icon, { size: 20 })}
                    </span>
                    {open && <span className="text-sm">{item.title}</span>}
                    <span className="ml-auto flex items-center">
                      <Plus className="hidden group-data-[state=closed]/collapsible:block" />
                      <Minus className="hidden group-data-[state=open]/collapsible:block" />
                    </span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {/* ✅ Ensure submenu items are always visible when expanded */}
                <CollapsibleContent className="pl-0">
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title} className="pl-4">
                        <SidebarMenuSubButton asChild>
                          <a
                            href={subItem.url}
                            className={`block px-4 py-2 text-sm transition ${
                              currentPath === subItem.url
                                ? "font-bold text-slate-400"
                                : "text-slate-500"
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
            // ✅ Standard menu items, ensuring icons and text align properly
            <SidebarMenuItem key={item.title} className="text-slate-500">
              <a
                href={item.url}
                className={`flex w-full items-center ${!open ? "p-2" : "px-4 py-2"} gap-2 rounded-md transition hover:bg-gray-100`}
                onClick={() => {
                  setOpen(true); // ✅ Allow manual toggling back open
                  setAutoClosed(false); // ✅ Reset auto-close tracking
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
