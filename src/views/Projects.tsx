import {
  useGetEntitiesQuery,
  useGetEntityByIdQuery,
  useGetStudyByIdQuery,
} from "@/api/documents/documentApi";
import SessionDialog from "@/components/common/dialogs/session-dialog";
import DocumentSkeleton from "@/components/common/loaders/document-skeleton";
// Import TipTap Editor
import Dashboard from "@/components/common/projects/dashboard";

import { useEffect } from "react";
import { useLocation, useParams } from "react-router";

export const Projects: React.FC = () => {
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
  }, [
    connectedComments,
    connectedEntities,
    connectedObjects,
    connectedQueries,
    fetchedEntity,
    parsedDescription,
  ]);

  return (
    <>
      {fetchedEntityIsLoading ? (
        <DocumentSkeleton />
      ) : (
        <>
          <div className="flex w-auto">
            <SessionDialog />
            <div className="w-full flex-col">
              <Dashboard
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

export default Projects;
