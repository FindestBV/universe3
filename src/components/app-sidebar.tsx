import { useSelector } from 'react-redux';
import { currentUser, setCredentials, logout } from '../services/auth/authSlice';
import { useDispatch } from 'react-redux'
import { Calendar, Inbox, Settings, ChevronUp, UserRoundPen, Bot, FileText, BookOpenCheck, Fingerprint } from "lucide-react"
import AdvancedSearchModal from "./advanced-search-modal";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Menu items.
const items = [
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
  {
    title: "Inbox",
    url: "/inbox",
    icon: Inbox,
  },
];

const advancedItems = [
  {
    title: "Q&A",
    url: "/library/queries",
    icon: Settings,
  },
];

import logoUniverse from '../assets/universe_logo_white.png';
import { useNavigate } from 'react-router';

export function AppSidebar() {
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 
  const user = useSelector(currentUser); 
   
  const handleLogin = () => {
    dispatch(setCredentials("generic@email.com"))
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  }

  return (
    <Sidebar className="bg-white">
      <div className="flex mx-auto w-full p-6 items-center justify-center">
        <a href="/" rel="preload"><img src={logoUniverse} alt="Findest logo" width="130px" height="45px" className="items-center justify-center" /></a>
      </div>

      <SidebarContent className="justify-between">

        <div className="group1 gap-10 p-4">
          <SidebarGroup>
            <SidebarGroupLabel>

            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <div key={item.title}>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    {item.sublinks && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.sublinks.map((sublink) => (
                          <li key={sublink.title}>
                            <a
                              href={`/library${sublink.url}`}
                              className="text-sm text-gray-300 hover:text-gray-500 py-1 flex gap-2"
                            >
                              <sublink.icon width={12} />
                              {sublink.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            
           
            <SidebarGroupLabel className="my-4">
              <Bot width={18} color={"white"} />
              <h1 className="font-black text-md ml-2">IGOR<sup>AI</sup>search</h1>
            </SidebarGroupLabel>
            <SidebarGroupContent>

              <SidebarMenu className="ml-8 mt-1 space-y-1">
                <AdvancedSearchModal />
                {advancedItems.map((item) => (
                  <div key={item.title}>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
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
                  <SidebarMenuButton>
                    <UserRoundPen width={'16'} color={'white'} />
                    <h1 className="font-black text-md p-6">Profile</h1>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span><a href="/inbox">{user ? `${user}'s` : ''} Inbox</a></span>
                  </DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem>
                    <span><a href="https://docs.findest.com" target="_blank">Resources</a></span>
                  </DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem>
                    <span>Admin</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {user ? <span><a href="#" onClick={handleLogout}>Log out</a></span> : 
                    <span><a href="#" onClick={handleLogin}>Log In</a></span>
                    }
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

      </SidebarContent>

    </Sidebar>
  )
}
