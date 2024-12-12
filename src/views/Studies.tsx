import { useState } from 'react';
import { useGetStudiesQuery } from '../services/study/study';
import { Filter, Loader } from "lucide-react";
import { ListPagination } from "@/components/list-pagination";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StudyCard } from '@/components/study-card';
import { Checkbox } from "@/components/ui/checkbox";

import { useSelector } from 'react-redux';
import { currentUser } from '@/services/auth/authSlice';

export const Studies: React.FC = () => {
    const [selectedStudies, setSelectedStudies] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(1);
    const limit = 10; // Number of studies per page
    const user = useSelector(currentUser);
    // Use RTK Query hook to fetch entities from API
    const { data: studyData, isLoading, isError, error } = useGetStudiesQuery(
      { page, limit },
      { refetchOnMountOrArgChange: true }
    );
  
    // Handle select all documents
    const handleSelectAll = (checked: boolean) => {
      if (checked && studyData) {
        setSelectedStudies(new Set(studyData.studies.map((study) => study.id)));
      } else {
        setSelectedStudies(new Set());
      }
    };
  
    // Handle individual document selection
    const handleSelectStudy = (id: string, checked: boolean) => {
      const newSelected = new Set(selectedStudies);
      if (checked) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      setSelectedStudies(newSelected);
    };
  
    // Pagination Handlers
    const handleNextPage = () => {
      if (studyData?.totalPages && page < studyData.totalPages) {
        setPage(page + 1);
      }
    };
  
    const handlePreviousPage = () => {
      if (page > 1) {
        setPage(page - 1);
      }
    };
  
    const handlePageChange = (newPage: number) => {
      setPage(newPage);
    };
  
    return (
      <div className="flex flex-col w-full h-full max-sm:px-4">
        <div className="flex w-full justify-between items-center">
          <h1 className="text-black font-black text-xl">Studies {user ? `- ${user}` : null }</h1>
          <div className="flex">
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-gray p-4 rounded-md flex w-full">
                <Filter /> Add Filter
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Basic Study Types</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Ideation</DropdownMenuItem>
                <DropdownMenuItem>Literature Study</DropdownMenuItem>
                <DropdownMenuItem>Technology Scouting</DropdownMenuItem>
                <DropdownMenuItem>Experimental Study</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>New</DropdownMenuItem>
                <DropdownMenuItem>Active</DropdownMenuItem>
                <DropdownMenuItem>Closed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg mb-4">
          <Checkbox
            id="select-all"
            checked={studyData ? selectedStudies.size === studyData.studies.length : false}
            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
          />
          <label
            htmlFor="select-all"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Select All Documents ({selectedStudies.size} of {studyData?.studies?.length || 0} selected)
          </label>
        </div>
        {/* Render loading, error, or data states */}
        {isError && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            Error loading studies: {JSON.stringify(error)}
          </div>
        )}
  
        {isLoading && (
          <div className="text-center py-8">
            <Loader className="animate-spin mx-auto mb-2" />
            <p>Loading studies...</p>
          </div>
        )}
  
        {studyData?.studies && studyData.studies.length > 0 && (
          <div className="p-4">
            {studyData.studies.map((study) => (
              <StudyCard
                key={study.id}
                {...study}
                title={study.title}
                isSelected={selectedStudies.has(study.id)}
                onSelect={handleSelectStudy}
              />
            ))}
          </div>
        )}
  
        {/* Pagination Controls */}
        <div className="py-4 w-full">
          <ListPagination
            currentPage={page}
            totalPages={studyData?.totalPages || 1}
            onPageChange={handlePageChange}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
          />
        </div>
      </div>
    );
  };
  
  export default Studies;