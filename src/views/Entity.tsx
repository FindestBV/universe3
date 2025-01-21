/* eslint-disable @typescript-eslint/no-explicit-any */
// Combine multiple calls to related endpoints on the one querySlice.
import { useGetEntityByIdQuery } from "@/api/documents/documentApi";
// Import TipTap Editor
import Editor from "@/components/common/editor/Editor";
import DocumentSkeleton from "@/components/common/loaders/document-skeleton";

import { useEffect } from "react";
import { useParams } from "react-router";

export const Entity: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: fetchedEntity, isLoading: fetchedEntityIsLoading } = useGetEntityByIdQuery(id, {
    refetchOnMountOrArgChange: false, // Prevents automatic refetching
  });

  const inboxQuery = fetchedEntity?.connectedInboxItems;
  const connectedObjects = fetchedEntity?.connectedDocs;
  const connectedQueries = fetchedEntity?.connectedQueries;
  const connectedComments = fetchedEntity?.connectedComments;

  let parsedDescription;
  if (fetchedEntity?.description) {
    try {
      parsedDescription = fetchedEntity?.description;
    } catch (error) {
      console.error("Failed to parse description:", error);
    }
  }

  useEffect(() => {
    if (fetchedEntity) {
      console.log("fetchedEntity", fetchedEntity);
    }
    window.scroll(0, 0);
  }, [fetchedEntity]);

  return (
    <>
      {fetchedEntityIsLoading ? (
        <DocumentSkeleton />
      ) : (
        <>
          <div className="flex h-screen w-auto">
            <div className="w-full flex-col">
              <Editor
                type={"entity"}
                title={fetchedEntity?.title}
                content={parsedDescription}
                connectedObjects={connectedObjects}
                connectedInbox={inboxQuery}
                connectedQueries={connectedQueries}
                connectedComments={connectedComments}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Entity;
