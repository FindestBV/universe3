import { currentUser, logout, setCredentials } from "@/api/auth/authSlice";
import logoUniverse from "@/assets/universe_logo_white.png";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  SidebarGroup,
  SidebarGroupContent,
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
  ChevronRight,
  ChevronUp,
  FileText,
  Fingerprint,
  Inbox,
  Settings,
  UserRoundIcon as UserRoundPen,
} from "lucide-react";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import AdvancedSearchModal from "../modals/advanced-search-modal";
import GenerateReport from "../modals/generate-report-modal";

// Main menu items
const items = [
  {
    title: "Inbox",
    url: "/inbox",
    icon: Inbox,
  },
  {
    title: "Universe",
    url: "/library/overview",
    icon: Calendar,
    sublinks: [
      { title: "Documents", url: "/documents", icon: FileText },
      { title: "Entities", url: "/entities", icon: Fingerprint },
      { title: "Studies", url: "/studies", icon: BookOpenCheck },
    ],
  },
];

const advancedItems = [
  {
    title: "Q&A",
    url: "/library/queries",
    icon: Settings,
  },
];

export function AppSidebar() {
  const dispatch = useDispatch();
  const navigateWithTransition = useNavigateWithTransition();
  const user = useSelector(currentUser);
  const { t } = useTranslation();

  const handleLogin = () => {
    dispatch(setCredentials("generic@findest.eu"));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigateWithTransition("/");
  };

  return (
    <Sidebar collapsible="icon" className="bg-white">
      <div className="mx-auto flex w-full items-center justify-center p-4">
        <a href="/dashboard" rel="preload">
          <img
            src={logoUniverse}
            alt="Findest logo"
            width="100px"
            height="25px"
            className="items-center justify-center transition-all duration-300 ease-in-out group-data-[collapsible=icon]:w-8"
          />
        </a>
      </div>

      <SidebarContent className="justify-between">
        <div className="group1 mt-9 gap-10 p-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-4 px-4">
                {items.map((item) => (
                  <Collapsible key={item.title} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          <item.icon />
                          <span className="font-bold">{item.title}</span>
                          {item.sublinks && (
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {item.sublinks && (
                        <CollapsibleContent>
                          <ul className="ml-8 mt-1 space-y-1">
                            {item.sublinks.map((sublink, idx) => (
                              <div key={idx}>
                                <SidebarMenuItem>
                                  <SidebarMenuButton asChild tooltip={sublink.title}>
                                    <a href={`/library${sublink.url}`}>
                                      <sublink.icon width={12} />
                                      <span className="font-bold">{sublink.title}</span>
                                    </a>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              </div>
                            ))}
                            <SidebarMenuItem>
                              <GenerateReport leftContent={"Left"} rightContent={"Right"} />
                            </SidebarMenuItem>
                          </ul>
                        </CollapsibleContent>
                      )}
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>

            <SidebarGroupLabel className="my-4">
              <Bot width={18} color={"white"} />
              <h1 className="text-md ml-2 font-black">
                IGOR<sup>AI</sup>search
              </h1>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-4 px-4">
                <AdvancedSearchModal />
                {advancedItems.map((item) => (
                  <div key={item.title}>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <a href={`${item.url}`}>
                          <item.icon width={12} />
                          <span className="font-bold">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <SidebarFooter className="p-6">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton tooltip={t("profile")}>
                    <UserRoundPen width={"16"} color={"white"} className="hover:text-black" />
                    <h1 className="text-md p-6 font-black">{t("profile")}</h1>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem>
                    <span>
                      <a href="/inbox">{user ? `${user}'s` : ""} Inbox</a>
                    </span>
                  </DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem>
                    <a href="#" onClick={() => navigateWithTransition("/resources")}>
                      <span>Resources</span>
                    </a>
                  </DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem>
                    <a href="#" onClick={() => navigateWithTransition("/admin")}>
                      <span>Admin</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href="#" onClick={() => navigateWithTransition("/user/settings")}>
                      <span>Settings</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {user ? (
                      <span>
                        <a href="#" onClick={handleLogout}>
                          Log out
                        </a>
                      </span>
                    ) : (
                      <span>
                        <a href="#" onClick={handleLogin}>
                          Log In
                        </a>
                      </span>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
