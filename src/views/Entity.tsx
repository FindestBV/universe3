/* eslint-disable @typescript-eslint/no-explicit-any */
import { currentUser } from "@/api/auth/authSlice";
import { useGetEntityByIdQuery } from "@/api/documents/documentApi";
import { renderProseMirrorContent } from "@/lib/renderProseMirror";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";

export const Entity: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const entity = location.state;
  const user = useSelector(currentUser);
  console.log("Entity user:", user);

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

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="flex h-full w-full flex-col p-12 max-sm:px-4">
      <div className="max-sm:px-4l mx-auto flex h-full w-3/4 flex-col px-12 py-4">
        <h1 className="mb-2 text-xl font-black text-black">{entity?.title || "Entity"}</h1>
        <span className="font-black text-black">Entity ID: {id}</span>
        <div className="text-black">
          {parsedDescription
            ? renderProseMirrorContent(parsedDescription)
            : "Lorem ipsum dolor sit amet consectetur."}
        </div>
      </div>
    </div>
  );
};

export default Entity;
