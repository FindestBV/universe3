import { currentUser, logout, setCredentials } from "@/api/auth/authSlice";
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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BookOpenCheck,
  Bot,
  Calendar,
  ChevronUp,
  FileText,
  Fingerprint,
  Inbox,
  Settings,
  UserRoundPen,
} from "lucide-react";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import AdvancedSearchModal from "../modals/advanced-search-modal";
import GenerateReport from "../modals/generate-report-modal";

// Menu items.
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
      { title: "Generate Report", url: "/generate-report", icon: BookOpenCheck },
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
  const navigate = useNavigate();
  const user = useSelector(currentUser);
  const { t } = useTranslation();

  const handleLogin = () => {
    dispatch(setCredentials("generic@email.com"));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Sidebar className="bg-white">
      <div className="mx-auto flex w-full items-center justify-center p-4">
        <a href="/dashboard" rel="preload">
          <img
            src={logoUniverse}
            alt="Findest logo"
            width="100px"
            height="25px"
            className="items-center justify-center"
          />
        </a>
      </div>

      <SidebarContent className="justify-between">
        <div className="group1 mt-9 gap-10 p-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-4 px-4">
                {items.map((item) => (
                  <div key={item.title}>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span className="font-bold">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    {item.sublinks && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.sublinks.map((sublink, idx) => (
                          <div key={idx}>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <a href={`/library${sublink.url}`}>
                                  <sublink.icon width={12} />
                                  <span className="font-bold">{sublink.title}</span>
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </div>
                        ))}
                      </ul>
                    )}
                  </div>
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
                      <SidebarMenuButton asChild>
                        <a href={`${item.url}`}>
                          <item.icon width={12} />
                          <span className="font-bold">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </div>
                ))}
                <GenerateReport />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <SidebarFooter className="p-6">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
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
                    <span>
                      <a href="https://docs.findest.com" target="_blank">
                        Resources
                      </a>
                    </span>
                  </DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem>
                    <span>Admin</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Settings</span>
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
    </Sidebar>
  );
}
