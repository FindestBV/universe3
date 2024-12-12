/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useFeature } from 'use-feature';
import { Clock, Pin, ChartNetwork, Search, SmilePlus, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SearchBar from './searchbar';
// import { setCredentials } from '@/services/auth';
import { currentUser } from '@/services/auth/authSlice';
import { useSelector } from 'react-redux';
import { useGetMyRecentActivityQuery } from '@/services/activity/activity';
// import { useNavigate } from 'react-router-dom';

// import { useWebSocket } from '../hooks/use-web-socket';
// import { Permission, usePermissionsChecker } from '../hooks/use-permissions-checker';

interface DashboardHeader {
    className?: string;
}

export default function DashboardHeader() {
    // const dispatch = useDispatch();
    // const navigate = useNavigate(); 
    const user = useSelector(currentUser);
    const { data: activityData } = useGetMyRecentActivityQuery();
    
    const powerUserFlag = useFeature('power user only', true);
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
      if(user === 'Ro'){
        console.log('feature flag', powerUserFlag);
      } else if(user === 'Javi'){
        console.log('feature flag but only for Javi', powerUserFlag);
      } else {
        console.log('nothing to see here');
      }
    },[powerUserFlag, user])

    return (
        <header className="flex flex-col gap-6 md:flex-row items-center justify-between bg-gray-150 p-6 w-full bg-gray-300 sticky top-0 z-10">
            {/* <input type="text" value={name} onChange={(e) => setName(e.target.value)}/> */}
            
            <div className="control-buttons">
                <ul className="flex gap-2">
                    <li>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button aria-label="Recent"><Clock width={18} color="black" /></Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Recent Activity</p>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                          <Button variant="rotated" className="h-8 w-8 p-0 hidden">
                                          <span className="sr-only">Open menu</span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        {activityData && activityData.map((activity:any, idx:string) => (
                                            <DropdownMenuItem key={idx}>{activity.name}</DropdownMenuItem>
                                          ))}
                                          <DropdownMenuItem><List /> Open in List View</DropdownMenuItem>
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
                                    <Button aria-label="Pinned"><Pin width={18} color="black" /></Button>
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
                                    <Button aria-label="Network Explorer"><ChartNetwork width={18} color="black" /></Button>
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
                                    <Button aria-label="Active queries"><Search width={18} color="black" /></Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>No active queries</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </li>
                </ul>
            </div>

            <SearchBar />
            
            <div className="flex items-center gap-2">
              
                {user ? <div className="flex items-center gap-2 pr-2">
                        <h3>Welcome back, {user}</h3>
                    
                </div> : null}  
                <div className="create-action flex items-center gap-2">
                    <Button variant="secondary">Create New</Button>
                    <Button name="Happiness" className="hover:bg-slate-300 text-white"><SmilePlus width={18} color="black" /></Button>
                </div>
            </div>
        </header>
    );
}
