/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetConnectedInboxItemsQuery,
  // useGetDocumentRelatedScienceArticlesQuery,
  useGetEntityByIdQuery,
} from "@/api/documents/documentApi";
import Editor from "@/components/shared/editor/Editor";
import DocumentSkeleton from "@/components/shared/loaders/document-skeleton";

import { useEffect } from "react";
import { useParams } from "react-router";

export const Entity: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: fetchedEntity, isLoading: fetchedEntityIsLoading } = useGetEntityByIdQuery(id, {
    refetchOnMountOrArgChange: false, // Prevents automatic refetching
  });

  const { data: inboxQuery } = useGetConnectedInboxItemsQuery(id, {
    refetchOnMountOrArgChange: false, // Prevents automatic refetching
  });

  console.log("inbox query item result", inboxQuery);
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
    window.scroll(0, 0);
  }, [fetchedEntity]);

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
                connectedDocs={inboxQuery}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Entity;
