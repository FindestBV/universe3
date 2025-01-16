/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetSideBarDocumentsQuery, useGetStudyByIdQuery } from "@/api/documents/documentApi";
import Editor from "@/components/common/editor/Editor";
import DocumentSkeleton from "@/components/common/loaders/document-skeleton";

import { useEffect } from "react";
import { useParams } from "react-router";

export const Study: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  let parsedDescription: any = null;

  const { data: fetchedStudy, isLoading: fetchedStudyIsLoading } = useGetStudyByIdQuery(id, {
    refetchOnMountOrArgChange: false, // Prevents automatic refetching
  });

  const connectedStudies = fetchedStudy?.connectedStudies;
  const connectedDocs = fetchedStudy?.connectedDocs;
  const connectedComments = fetchedStudy?.connectedComments;
  const inboxQuery = fetchedStudy?.connectedInboxItems;

  if (fetchedStudy?.description) {
    console.log("fetched study full obj", fetchedStudy);
    try {
      parsedDescription = JSON.parse(fetchedStudy?.description);
      console.log("Parsed description:", parsedDescription);
    } catch (error) {
      console.error("Failed to parse description:", error);
    }
  }

  useEffect(() => {
    if (fetchedStudy) {
      console.log("fetched", fetchedStudy);
      console.log("study connections", connectedStudies);
      console.log("study queries", connectedDocs);
      console.log("study inbox", inboxQuery);
      console.log("connected comments", connectedComments);
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
            <div className="w-full flex-col">
              <Editor
                type={"study"}
                title={fetchedStudy?.title}
                content={parsedDescription}
                connectedInbox={inboxQuery}
                connectedObjects={connectedDocs}
                connectedQueries={connectedStudies}
                connectedComments={connectedComments}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Study;
