/* eslint-disable @typescript-eslint/no-explicit-any */
// Combine multiple calls to related endpoints on the one querySlice.
import { useGetEntityByIdQuery } from "@/api/documents/documentApi";
// Import TipTap Editor
import BlockEditor from "@/components/common/editor/BlockEditor/BlockEditor";
import DocumentSkeleton from "@/components/common/loaders/document-skeleton";

import { useEffect } from "react";
import { useParams } from "react-router";

export const Entity: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  let parsedDescription: any = null;

  const { data: fetchedEntity, isLoading: fetchedEntityIsLoading } = useGetEntityByIdQuery(id, {
    refetchOnMountOrArgChange: false, // Prevents automatic refetching
  });

  const inboxQuery = fetchedEntity && fetchedEntity?.connectedInboxItems;
  const connectedObjects = fetchedEntity && fetchedEntity?.connectedDocs;
  const connectedQueries = fetchedEntity && fetchedEntity?.connectedQueries;
  const connectedComments = fetchedEntity && fetchedEntity?.connectedComments;

  if (fetchedEntity) {
    console.log("fetched entity full obj", fetchedEntity.description);
    try {
      parsedDescription = JSON.parse(fetchedEntity.description);
      console.log("Parsed description:", parsedDescription.content);
    } catch (error) {
      console.error("Failed to parse description:", error);
    }
  }

  useEffect(() => {
    if (parsedDescription) {
      console.log("blooper", typeof parsedDescription);
      console.log("connectedObjects", connectedObjects);
      console.log("connectedQueries", connectedQueries);
      console.log("connectedComments", connectedComments);
      console.log("blooper", parsedDescription);
    }
    window.scroll(0, 0);
  }, [fetchedEntity, parsedDescription]);

  return (
    <>
      {fetchedEntityIsLoading ? (
        <DocumentSkeleton />
      ) : (
        <>
          <div className="flex w-auto">
            <div className="w-full flex-col">
              <BlockEditor
                type={"entity"}
                id={fetchedEntity?.id}
                title={fetchedEntity?.title}
                content={parsedDescription}
                connectedObjects={connectedObjects}
                connectedInbox={inboxQuery}
                connectedQueries={connectedQueries}
                connectedComments={connectedComments}
                // connectedEntities={fetchedEntity?.entities}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Entity;
