/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderProseMirrorContent } from "@/lib/renderProseMirror";
import { currentUser } from "@/services/auth/authSlice";
import { useGetEntityByIdQuery } from "@/services/entities/entityApi";

import React from "react";
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

  console.log("fetched entity", fetchedEntity);

  return (
    <div className="flex h-full w-full flex-col p-12 max-sm:px-4">
      <div className="flex h-screen w-auto flex-col">
        <h1 className="mb-2 text-xl font-black text-black">{entity?.title || "Entity"}</h1>
        <p>{user ? `User: ${user}` : null}</p>
        <p>
          <span className="font-black text-black">Entity ID:</span> {id}
        </p>
        <br />
        <p className="text-black">
          {parsedDescription
            ? renderProseMirrorContent(parsedDescription)
            : "Lorem ipsum dolor sit amet consectetur."}
        </p>
      </div>
    </div>
  );
};

export default Entity;
