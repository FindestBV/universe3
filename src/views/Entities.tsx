/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useGetEntitiesQuery } from '../services/entities/entityApi';
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
import { EntityCard } from '@/components/entity-card';
import { Checkbox } from "@/components/ui/checkbox";

 

export const Entities: React.FC = () => {
    const [selectedEntities, setSelectedEntities] = useState<Set<string>>(new Set());
    const [hasCachedData, setHasCachedData] = useState(false);

    // Use RTK Query hook to fetch entities from API
    const { data: entityData, isLoading, isError, error } = useGetEntitiesQuery(
        undefined, {
            refetchOnMountOrArgChange: false, // Prevents automatic refetching
    });
    
    useEffect(() => {
        // Set hasCachedData to true if data is initially fetched
        if (entityData) {
            setHasCachedData(true);
        }
    }, [entityData]);

    // Handle select all documents
    const handleSelectAll = (checked: boolean) => {
        if (checked && entityData) {
            // @ts-nocheck abc
            setSelectedEntities(new Set(entityData.entities.map((entity: { id: any; }) => entity.id)));
        } else {
            setSelectedEntities(new Set());
        }
    };

    // Handle individual document selection
    const handleSelectEntity = (id: string, checked: boolean) => {
        const newSelected = new Set(selectedEntities);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedEntities(newSelected);
    };



    // console.log('entities', entityData); 

    // Render loading, error, or data states
    return (
        <div className="flex flex-col w-full h-full max-sm:px-4">
            <div className="flex w-full justify-between items-center">
                <h1 className="text-black font-black text-xl">Entities</h1>
                <div className="flex">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="bg-gray p-4 rounded-md flex w-full">
                            <Filter /> Add Filter
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Custom Entity Types</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Basic</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Technology</DropdownMenuItem>
                            <DropdownMenuItem>Material</DropdownMenuItem>
                            <DropdownMenuItem>Process</DropdownMenuItem>
                            <DropdownMenuItem>Method</DropdownMenuItem>
                            <DropdownMenuItem>Ingredient</DropdownMenuItem>
                            <DropdownMenuItem>Chemical</DropdownMenuItem>
                            <DropdownMenuItem>Product</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Organisation</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Partner</DropdownMenuItem>
                            <DropdownMenuItem>Supplier</DropdownMenuItem>
                            <DropdownMenuItem>Competitor</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Other Entity Types</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Entity</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Started By</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Ro</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <ListPagination />
                </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg mb-4">
                <Checkbox
                    id="select-all"
                    checked={entityData ? selectedEntities.size === entityData?.entities?.length : false}
                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
                <label 
                    htmlFor="select-all"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Select All Documents ({selectedEntities.size} of {entityData?.entities?.length || 0} selected)
                </label>
            </div>
                {/* Render loading, error, or data states */}
                {isError && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-md">
                        Error loading entities: {JSON.stringify(error)}
                    </div>
                )}

                {isLoading && !hasCachedData && ( // Show spinner only if loading and no cached data is available
                    <div className="text-center py-8">
                        <Loader className="animate-spin mx-auto mb-2" />
                        <p>Loading entities...</p>
                    </div>
                )}

                {entityData?.entities && entityData.entities.length > 0 && (
                    <div className="p-4">
                        {entityData.entities.map((entity) => (
                            <EntityCard
                                key={entity.id}
                                {...entity}
                                isSelected={selectedEntities.has(entity.id)}
                                onSelect={handleSelectEntity} />
                        ))}
                    </div>
                )}
            
            <div className="py-4 w-full">
                <ListPagination />
            </div>
        </div>
    );
};

export default Entities;