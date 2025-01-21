/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetStudyByIdQuery } from "@/api/documents/documentApi";
import { BlockEditor } from "@/components/common/editor/BlockEditor";
import DocumentSkeleton from "@/components/common/loaders/document-skeleton";

import { useEffect } from "react";
import { useParams } from "react-router";

export const Study: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  let parsedDescription: any = null;

  const { data: fetchedStudy, isLoading: fetchedStudyIsLoading } = useGetStudyByIdQuery(id, {
    refetchOnMountOrArgChange: false, // Prevents automatic refetching
  });

  console.log("fetchedStudy", fetchedStudy);

  const connectedStudies = fetchedStudy && fetchedStudy?.connectedStudies;
  const connectedDocs = fetchedStudy && fetchedStudy?.connectedDocs;
  const connectedComments = fetchedStudy && fetchedStudy?.connectedComments;
  const inboxQuery = fetchedStudy && fetchedStudy?.connectedInboxItems;
  const connectedEntities = fetchedStudy && fetchedStudy?.connectedInboxItems;

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
          <div className="flex w-auto">
            <div className="w-full flex-col">
              <BlockEditor
                type={"study"}
                id={fetchedStudy?.id}
                title={fetchedStudy?.title}
                content={parsedDescription}
                connectedEntities={fetchedStudy?.entities}
                connectedInbox={inboxQuery}
                connectedObjects={connectedDocs}
                connectedQueries={connectedStudies}
                connectedComments={connectedComments}
                connectedStudies={connectedStudies}
                ydoc={undefined}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Study;
