import { useGetMyRecentActivityQuery } from '../services/activity/activity';
import { Link, MoreHorizontal, SquareArrowOutUpRight, ScanEye, Network, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { useNavigate } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import DataChart from "@/components/data-chart";
import { useSelector } from 'react-redux';
import { currentUser } from '@/services/auth/authSlice';
export const Dashboard = () => {

    const { data: activityData } = useGetMyRecentActivityQuery();
    const navigate = useNavigate();
    const user = useSelector(currentUser);

    const handleNavigateToEntities = (type:string, id:string) => {
        let redirRoute; 
        if(type == 'Entity'){
            redirRoute = 'entities'; 
        } else {
            redirRoute = 'studies'; 
        }; 
        navigate(`/library/${redirRoute}/${id}`, { state: { id } });
    };


    const getRandomTitle = () => {
        const words = ["Random", "Sample", "Test", "Generated", "Dummy", "Title", "Example", "Content", "Headline"];
        const wordCount = Math.floor(Math.random() * 5) + 2; // Random title length between 2 and 6 words
        return Array.from({ length: wordCount }, () => words[Math.floor(Math.random() * words.length)]).join(" ");
    };

    const getRandomTime = () => {
        const hours = (Math.floor(Math.random() * 10) + 8).toString().padStart(2, '0'); // Random hour from 08 to 17
        const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0'); // Random minute from 00 to 59
        return `${hours}:${minutes}`;
    };

    // console.log('data', activityData);
    return(
        <div className="flex flex-col w-full h-screen max-sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* TODO: add dynamic units later */}
    
            <div  className="flex flex-col space-y-3 w-full max-sm:px-4 overflow-hidden">
                <h2 className='font-black text-lg items-start'>{user} Pick up where you left off...</h2>
                <div className="flex flex-col items-start justify-start h-[350px] w-full rounded-xl gap-2 overflow-y-scroll">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {activityData && activityData.map((activity:any, idx:string) => (
                        <div key={idx} className="flex flex-col items-start w-full max-sm:px-4 bg-green-50 rounded-md p-4 cursor-pointer shadow-md" onClick={() => handleNavigateToEntities(activity.type, activity.id)}>
                            <p className="flex gap-2 text-sm items-center"><Link size={'12px'} /> {activity.type}</p>
                            <div className='flex justify-between w-full items-center'>
                            <h3 className="font-black">{activity.name}</h3>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="rotated" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem><SquareArrowOutUpRight /> Open Page</DropdownMenuItem>
                                    <DropdownMenuItem><ScanEye /> Open Preview</DropdownMenuItem>
                                    <DropdownMenuItem><Network /> Open in Tree View</DropdownMenuItem>
                                    <DropdownMenuItem><List /> Open in List View</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                        </div>
                      ))}
                    </div>
            
            </div>
    
            <div  className="flex flex-col space-y-3 w-full max-sm:px-4">
                <h2 className='font-black text-lg items-start'>Relations Graph</h2>
                <div className="flex items-center justify-center  animate-pulse bg-muted h-[350px] w-full rounded-xl">
                  <DataChart />
                </div>
            </div>
    
            <div  className="flex flex-col space-y-3 w-full max-sm:px-4 overflow-hidden">
                <h2 className='font-black text-lg items-start'>What's happening at Findest?</h2>
                <div className="flex flex-col items-start justify-start h-[350px] w-full rounded-xl gap-2 overflow-y-scroll">
                
                    {[...Array(15)].map((_, index) => (
                        <div key={index} className="flex flex-row items-center w-full max-sm:px-4 bg-green-200 rounded-md p-4">
                            <Avatar>
                                <AvatarImage src="https://avatars.githubusercontent.com/u/6318762?v=4&size=64" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="flex justify-between w-full items-center">
                                <p className="pl-4">{getRandomTitle()}</p>
                                <span className="pl-4 text-gray-500 text-sm">{getRandomTime()}</span>
                            </div>
                        </div>
                    ))}
                    </div>
            
            </div>
    
            <div  className="flex flex-col space-y-3 w-full max-sm:px-4">
                <h2 className='font-black text-lg items-start'>Page Type Breakdown</h2>
                <div className="flex items-center justify-center animate-pulse bg-muted h-[350px] w-full rounded-xl">
                <h3 className="text-white">Panel</h3> 
                </div>
            </div>
        
        </div>
        </div>
    );
};

export default Dashboard; 