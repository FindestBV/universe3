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

  if (fetchedEntity?.description) {
    console.log("fetched entity full obj", fetchedEntity.description);
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
          <div className="flex w-auto">
            <div className="w-full flex-col">
              <BlockEditor
                type={"entity"}
                title={fetchedEntity?.title}
                content={parsedDescription}
                connectedObjects={connectedObjects}
                connectedInbox={inboxQuery}
                connectedQueries={connectedQueries}
                connectedComments={connectedComments}
                ydoc={undefined}
                id={fetchedEntity.id}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Entity;
