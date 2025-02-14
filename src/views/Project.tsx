import {
  useGetEntitiesQuery,
  useGetEntityByIdQuery,
  useGetStudyByIdQuery,
} from "@/api/documents/documentApi";
// Import TipTap Editor
import BlockEditor from "@/components/common/editor/Projects/BlockEditor";
import DocumentSkeleton from "@/components/common/loaders/document-skeleton";

import { useEffect } from "react";
import { useLocation, useParams } from "react-router";

export const Project: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  let parsedDescription: any = null;

  // ✅ Determine whether to fetch "studies" or "entities" based on the URL
  const isProjectsPage = location.pathname.includes("projects");

  const { data: fetchedEntity, isLoading: fetchedEntityIsLoading } = isProjectsPage
    ? useGetStudyByIdQuery(id, { refetchOnMountOrArgChange: false })
    : useGetEntityByIdQuery(id, { refetchOnMountOrArgChange: false });

  const { data, isLoading, isError, error, refetch } = useGetEntitiesQuery(
    { page: 1, limit: 10 }, // Adjust page and limit as needed
    { refetchOnMountOrArgChange: true },
  );

  const inboxQuery = fetchedEntity?.connectedInboxItems;
  const connectedObjects = fetchedEntity?.connectedDocs;
  const connectedQueries = fetchedEntity?.connectedQueries;
  const connectedComments = fetchedEntity?.connectedComments;
  const connectedEntities = fetchedEntity?.entities;

  if (fetchedEntity) {
    console.log("fetched entity full obj", fetchedEntity);
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
      console.log("connectedEntities", connectedEntities);
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
                type={"study"}
                id={fetchedEntity?.id}
                title={fetchedEntity?.title}
                content={parsedDescription}
                connectedObjects={connectedObjects}
                connectedInbox={inboxQuery}
                connectedQueries={connectedQueries}
                connectedComments={connectedComments}
                connectedEntities={fetchedEntity?.entities}
                connectedStudies={connectedObjects}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Project;
