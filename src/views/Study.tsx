/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetConnectedInboxItemsQuery,
  useGetDocumentRelatedScienceArticlesQuery,
  useGetSideBarDocumentsQuery,
  useGetStudyByIdQuery,
} from "@/api/documents/documentApi";
import Editor from "@/components/shared/editor/Editor";
import DocumentSkeleton from "@/components/shared/loaders/document-skeleton";

import { useEffect, useState } from "react";
import { useParams } from "react-router";

export const Study: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  let parsedDescription: any = null;

  const { data: fetchedStudy, isLoading: fetchedStudyIsLoading } = useGetStudyByIdQuery(id, {
    refetchOnMountOrArgChange: false, // Prevents automatic refetching
  });

  const { data: inboxQuery } = useGetConnectedInboxItemsQuery(id, {
    refetchOnMountOrArgChange: false, // Prevents automatic refetching
  });

  const { data: sidebarDocs } = useGetSideBarDocumentsQuery(id, {
    refetchOnMountOrArgChange: false, // Prevents automatic refetching
  });

  if (fetchedStudy?.description) {
    console.log("fetched study full obj", fetchedStudy);
    console.log("fetched study desc obj", JSON.parse(fetchedStudy?.description));
    try {
      parsedDescription = JSON.parse(fetchedStudy?.description);
      console.log("Parsed description:", parsedDescription);
    } catch (error) {
      console.error("Failed to parse description:", error);
    }
  }

  useEffect(() => {
    if (fetchedStudy) {
      console.log(fetchedStudy);
    }
    window.scroll(0, 0);
  }, [fetchedStudy]);

  return (
    <>
      {fetchedStudyIsLoading ? (
        <DocumentSkeleton />
      ) : (
        <>
          <div className="flex h-screen w-auto">
            <div className="flex-col">
              <Editor
                type={"study"}
                title={fetchedStudy?.title}
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

export default Study;
