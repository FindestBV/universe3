/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useParams, useLocation } from 'react-router';

import { renderProseMirrorContent } from "@/lib/renderProseMirror";
import { useSelector } from 'react-redux';
import { currentUser } from '@/services/auth/authSlice';
import { useGetEntityByIdQuery } from '@/services/entities/entityApi';

export const Entity: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const entity = location.state;
    const user = useSelector(currentUser);
    console.log('Entity user:', user);

    let parsedDescription: any = null;
    if (entity?.description) {
      try {
        parsedDescription = JSON.parse(entity.description);
        console.log("Parsed description:", parsedDescription);
      } catch (error) {
        console.error("Failed to parse description:", error);
      }
    }


    const { data: fetchedEntity } = useGetEntityByIdQuery(id, {
      refetchOnMountOrArgChange: false, // Prevents automatic refetching
    });


    console.log('fetched entity', fetchedEntity);

    return (
        <div className="flex flex-col w-full h-full max-sm:px-4">
            <div className="flex flex-col w-auto h-screen">
                <h1 className="text-xl text-black font-black mb-2">
                    {entity?.title || 'Entity'}
                </h1>
                <p>{user ? `User: ${user}` : null}</p>
                <p>
                    <span className="text-black font-black">Entity ID:</span> {id}
                </p>
                <br />
                <p className="text-black">
                    {parsedDescription
                        ? renderProseMirrorContent(parsedDescription)
                        : 'Lorem ipsum dolor sit amet consectetur.'}
                </p>
               
            </div>
        </div>
    );
};


export default Entity;