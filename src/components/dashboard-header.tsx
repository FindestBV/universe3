/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGetMyRecentActivityQuery } from "@/services/activity/activity";
// import { setCredentials } from '@/services/auth';
import { currentUser } from "@/services/auth/authSlice";
import { ChartNetwork, Clock, List, Pin, Search, SmilePlus } from "lucide-react";
import { useFeature } from "use-feature";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import CreateItemModal from "./create-item-modal";
import HappinessSelector from "./happiness-selector";
import LanguageSelector from "./language-selector";
import SearchBar from "./searchbar";

interface DashboardHeader {
  className?: string;
}

export const DashboardHeader = () => {
  const { t } = useTranslation();
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  const user = useSelector(currentUser);
  const { data: activityData } = useGetMyRecentActivityQuery();

  const powerUserFlag = useFeature("power user only", true);
  // const [user, setUser] = useState('Ro');
  // const { isConnected, sendMessage, lastMessage } = useWebSocket('ws://localhost:4000/chat', {
  //     reconnect: true,
  //     reconnectInterval: 3000,
  //     onOpen: () => console.log('Connected to WebSocket'),
  //     onMessage: (event) => console.log('New message received:', event.data),
  //     onClose: () => console.log('Disconnected from WebSocket'),
  //   });

  // console.log('from websocket hook', isConnected)
  // console.log('sendMessage websocket hook', sendMessage)

  // const handleLogIn = () => {
  //   console.log('handle login');
  //   const usr = {
  //     email: 'generic@email.com',
  //     password: 'p4ssw0rd',
  //   }
  //   dispatch(setCredentials(usr.email))
  // }

  // const handleLogOut = () => {
  //   console.log(`log out ${user}`);
  //   dispatch(logout());
  //   navigate('/');
  // }

  useEffect(() => {
    if (user === "Ro") {
      console.log("feature flag", powerUserFlag);
    } else if (user === "Javi") {
      console.log("feature flag but only for Javi", powerUserFlag);
    } else {
      console.log("nothing to see here");
    }
  }, [powerUserFlag, user]);

  return (
    <header className="dashBoardHeader">
      <div className="control-buttons">
        <ul className="flex gap-1">
          <li>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button aria-label="Recent" className="px-2">
                    <Clock width={20} color="black" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Recent Activity</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="rotated" className="hidden h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {activityData &&
                        activityData.map((activity: any, idx: string) => (
                          <DropdownMenuItem key={idx}>{activity.name}</DropdownMenuItem>
                        ))}
                      <DropdownMenuItem>
                        <List /> Open in List View
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button aria-label="Pinned" className="p-2">
                    <Pin width={20} color="black" fill="black" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pinned</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button aria-label="Network Explorer" className="p-2">
                    <ChartNetwork width={20} color="black" strokeWidth={2} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Network Explorer</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>

          <li>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="relative p-2" aria-label="Active queries">
                    <span className="indicator">1</span>
                    <Search width={20} color="black" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>No active queries</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </div>
      <div className="hidden sm:block">
        <SearchBar />
      </div>

      <div className="flex items-center gap-2">
        {/* <span className="hidden sm:block">
                {user ? <h3>{t('welcome')} {user}</h3> : null}
                </span> */}
        <LanguageSelector />
        <div className="create-action hidden items-center gap-2 sm:flex">
          <CreateItemModal />
          <HappinessSelector />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
