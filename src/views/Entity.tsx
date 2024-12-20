/* eslint-disable @typescript-eslint/no-explicit-any */
import { currentUser } from "@/api/auth/authSlice";
import { useGetEntityByIdQuery } from "@/api/documents/documentApi";
import DocumentSkeleton from "@/components/shared/loaders/document-skeleton";
import { renderProseMirrorContent } from "@/lib/renderProseMirror";
import { Loader } from "lucide-react";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

export const Entity: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const location = useLocation();
  // const entity = location.state;
  const user = useSelector(currentUser);
  console.log("Entity user:", user);

  let parsedDescription: any = null;

  const { data: fetchedEntity, isLoading: fetchedEntityIsLoading } = useGetEntityByIdQuery(id, {
    refetchOnMountOrArgChange: false, // Prevents automatic refetching
  });

  if (fetchedEntity?.description) {
    try {
      parsedDescription = JSON.parse(fetchedEntity.description);
      console.log("Parsed description:", parsedDescription);
    } catch (error) {
      console.error("Failed to parse description:", error);
    }
  }

  console.log("fetched Entity", fetchedEntity);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      {fetchedEntityIsLoading ? (
        <DocumentSkeleton />
      ) : (
        <div className="flex h-full w-full flex-col p-12 max-sm:px-4">
          <div className="max-sm:px-4l mx-auto flex h-full w-3/4 flex-col px-12 py-4">
            <>
              <h1 className="mb-2 text-xl font-black text-black">
                {fetchedEntity?.title || "Entity"}
              </h1>
              <span className="font-black text-black">Entity ID: {id}</span>
              <div className="text-black">
                {parsedDescription
                  ? renderProseMirrorContent(parsedDescription)
                  : "Lorem ipsum dolor sit amet consectetur."}
              </div>
            </>
          </div>
        </div>
      )}
    </>
  );
};

export default Entity;
