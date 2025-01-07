/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetEntityByIdQuery } from "@/api/documents/documentApi";
import Editor from "@/components/shared/editor/Editor";
import DocumentSkeleton from "@/components/shared/loaders/document-skeleton";

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
      console.log("Parsed entity description type:", typeof parsedDescription);
    } catch (error) {
      console.error("Failed to parse description:", error);
    }
  }

  useEffect(() => {
    if (fetchedEntity) {
      console.log("fetchedEntity", fetchedEntity);
    }
    if (connectedComments) {
      console.log("connectedComments", connectedComments);
    }
    if (connectedObjects) {
      console.log("connectedObjects", connectedObjects);
    }
    if (inboxQuery) {
      console.log("inboxQuery", inboxQuery);
    }
    window.scroll(0, 0);
  }, [connectedComments, connectedObjects, fetchedEntity, inboxQuery]);

  return (
    <>
      {fetchedEntityIsLoading ? (
        <DocumentSkeleton />
      ) : (
        <>
          <div className="flex h-screen w-auto">
            <div className="flex-col">
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
