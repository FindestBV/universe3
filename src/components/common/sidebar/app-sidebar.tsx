/**
 * AppSidebar Component
 *
 * This component serves as the **global sidebar navigation** in the application.
 * It allows users to navigate between different sections such as:
 * - **Inbox**
 * - **Projects**
 * - **Pages** (Entities, Studies)
 * - **Search** (General, Team, Billing, Limits)
 *
 * ## Features:
 * - **Collapsible Sidebar:** Users can toggle between an expanded or icon-only view.
 * - **Dynamic Menu Items:** Supports nested navigation with expandable sub-menus.
 * - **User Avatar Integration:** Displays the current user's profile picture.
 * - **State Management:** Uses `useSidebar()` for sidebar state control.
 * - **Persistent Sidebar State:** Saves the open/closed state to localStorage.
 * - **Active Page Highlighting:** Highlights the currently active page.
 * - **Hooks into Redux Store:** Retrieves the authenticated user from `authSlice`.
 *
 * ## How to Customize:
 * - Modify `data.navMain` to add or remove sections.
 * - Adjust `SidebarToggle` to change the sidebar behavior.
 * - Modify `NavMain` to update the navigation UI.
 * - Add new sections using `SidebarMenuItem` and `SidebarMenuSubItem`.
 * - Adjust sidebar styles via `className` for background, borders, etc.
 *
 * @component
 * @example
 * <AppSidebar isOpen={true} />
 *
 * @param {boolean} isOpen - Controls whether the sidebar is open or collapsed.
 * @returns {JSX.Element} The rendered AppSidebar component.
 */
import { currentUser } from "@/api/auth/authSlice";
import { NavMain } from "@/components/common/sidebar/nav-main";
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

import { useSelector } from "react-redux";

// Sidebar Data
const data = {
  user: {
    name: "Ronan O'Leary",
    email: "ronan.oleary@findest.eu",
    avatar: "/assets/images/ro-bw.d434f415.png",
  },

  navMain: [
    { title: "Inbox", url: "#", icon: SquareTerminal },
    {
      title: "Projects",
      url: "#",
      icon: Circle,
      isActive: false,
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    {
      title: "Pages",
      url: "#",
      icon: File,
      items: [
        { title: "Entities", url: "/pages/entities" },
        { title: "Studies", url: "/pages/studies" },
      ],
    },
    {
      title: "Search",
      url: "#",
      icon: Link,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" },
      ],
    },
  ],
};

// Sidebar Toggle Component
function SidebarToggle() {
  const { toggleSidebar, isOpen = false } = useSidebar(); // ✅ Ensure `isOpen` is defined

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          onClick={toggleSidebar}
          className="w-full items-center justify-start gap-1 hover:bg-none"
        >
          <div className="mt-1 flex aspect-square size-8 items-center justify-center rounded-lg">
            <Globe className={`size-5 ${isOpen ? "text-slate-600" : "text-white"}`} />
          </div>
          <div className="mt-1 grid flex-1 text-left text-lg text-gray-700">
            <span className="truncate font-semibold">Universe</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// Main Sidebar Component
export function AppSidebar({ isOpen: propIsOpen, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isOpen: contextIsOpen } = useSidebar(); // ✅ Get sidebar state from context
  const sidebarState = contextIsOpen ?? propIsOpen; // ✅ Ensure sidebarState is always defined

  const user = useSelector(currentUser); // Get user from Redux

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className={`mainSidebar ${sidebarState ? "bg-white" : "bg-[#757575]"}`}
    >
      <SidebarHeader>
        <SidebarToggle />
      </SidebarHeader>

      <SidebarContent className="mt-9">
        <NavMain items={data.navMain} sidebarState={sidebarState} />{" "}
        {/* ✅ Ensure sidebarState is passed */}
      </SidebarContent>

      <SidebarFooter className="sidebarFooter">
        <UserAvatar username={user?.name} /> {/* ✅ Ensure `user?.name` is passed correctly */}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
