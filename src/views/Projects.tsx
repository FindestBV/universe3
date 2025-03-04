import {
  useGetEntitiesQuery,
  useGetEntityByIdQuery,
  useGetStudyByIdQuery,
} from "@/api/documents/documentApi";
import SessionDialog from "@/components/common/dialogs/session-dialog";
// Import TipTap Editor
import DocumentSkeleton from "@/components/common/loaders/document-skeleton";

import { useEffect } from "react";
import { useLocation, useParams } from "react-router";

export const Projects: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // ✅ Determine whether to fetch "studies" or "entities" based on the URL
  const isProjectsPage = location.pathname.includes("projects");

  const { data: fetchedEntity, isLoading: fetchedEntityIsLoading } = isProjectsPage
    ? useGetStudyByIdQuery(id, { refetchOnMountOrArgChange: false })
    : useGetEntityByIdQuery(id, { refetchOnMountOrArgChange: false });

  const { data, isLoading, isError, error, refetch } = useGetEntitiesQuery();

  useEffect(() => {
    window.scroll(0, 0);
  }, [fetchedEntity]);

  return (
    <>
      {fetchedEntityIsLoading ? (
        <DocumentSkeleton />
      ) : (
        <>
          <div className="flex w-auto">
            <SessionDialog />
            {/* <div className="w-full flex-col">
              Default
            </div> */}
          </div>
        </>
      )}
    </>
  );
};

export default Projects;
