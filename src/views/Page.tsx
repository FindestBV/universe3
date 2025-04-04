import {
  useGetEntitiesQuery,
  useGetEntityByIdQuery,
  useGetStudyByIdQuery,
} from "@/api/documents/documentApi";
// Import TipTap Editor
import BlockEditor from "@/components/common/editor/BlockEditor/BlockEditor";
import DocumentSkeleton from "@/components/common/loaders/document-skeleton";

import { useEffect } from "react";
import { useLocation, useParams } from "react-router";

export const Page = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  let parsedDescription: { content: string } | null = null;

  // Determine whether to fetch "studies" or "entities" based on the URL
  const isStudiesPage = location.pathname.includes("studies");

  const { data: fetchedEntity, isLoading: fetchedEntityIsLoading } = isStudiesPage
    ? useGetStudyByIdQuery(id || "", { refetchOnMountOrArgChange: false })
    : useGetEntityByIdQuery(id || "", { refetchOnMountOrArgChange: false });

  const { data, isLoading: entitiesLoading } = useGetEntitiesQuery(
    { page: 1, limit: 10 },
    { refetchOnMountOrArgChange: true },
  );

  const inboxQuery = fetchedEntity?.connectedInboxItems || [];
  const connectedObjects = fetchedEntity?.connectedDocs || [];
  const connectedQueries = fetchedEntity?.connectedQueries || [];
  const connectedComments = fetchedEntity?.connectedComments || [];
  const connectedEntities = fetchedEntity?.entities || [];

  console.log("page connected queries", connectedQueries);
  if (fetchedEntity) {
    try {
      parsedDescription = JSON.parse(fetchedEntity.description || "{}");
      console.log("Parsed description:", parsedDescription.content);
    } catch (error) {
      console.error("Failed to parse description:", error);
    }
  }

  useEffect(() => {
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
                type={isStudiesPage ? "study" : "entity"}
                id={fetchedEntity?.id}
                title={fetchedEntity?.title}
                content={parsedDescription}
                connectedObjects={connectedObjects}
                connectedInbox={inboxQuery}
                connectedQueries={connectedQueries}
                connectedComments={connectedComments}
                connectedEntities={connectedEntities}
                connectedStudies={connectedObjects}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Page;
