import {
  useGetEntitiesQuery,
  useGetEntityByIdQuery,
  useGetStudyByIdQuery,
} from "@/api/documents/documentApi";
import { useGetProjectOverviewQuery } from "@/api/projects/projectApi";
import { setCurrentProject, setTabs } from "@/api/projects/projectSlice";
import DocumentSkeleton from "@/components/common/loaders/document-skeleton";
// Import TipTap Editor
import { Dashboard } from "@/components/common/projects/dashboard";
import { useAppDispatch } from "@/store";
import type { Entity, Study } from "@/types/types";

import { useEffect } from "react";
import { useLocation, useParams } from "react-router";

interface ConnectedData {
  connectedInboxItems?: string;
  connectedDocs?: string;
  connectedQueries?: string;
  connectedComments?: string;
  entities?: string[];
  description?: string;
  title?: string;
}

type ExtendedEntity = Entity & ConnectedData;
type ExtendedStudy = Study & ConnectedData;

export const Project = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();

  let parsedDescription: any = null;

  // ✅ Determine whether to fetch "studies" or "entities" based on the URL
  const isProjectsPage = location.pathname.includes("projects");

  const { data: fetchedEntity, isLoading: fetchedEntityIsLoading } = isProjectsPage
    ? useGetStudyByIdQuery(id || "", { skip: !id })
    : useGetEntityByIdQuery(id || "", { skip: !id });

  const { data: projectsData } = useGetProjectOverviewQuery(id || "", {
    skip: !id,
  });

  // Update Redux store when project data changes
  useEffect(() => {
    if (projectsData) {
      // Update current project
      dispatch(setCurrentProject(projectsData));

      // Update tabs if available
      if (projectsData.tabs) {
        dispatch(setTabs(projectsData.tabs));
      }
    }
  }, [projectsData, dispatch]);

  const extendedEntity = fetchedEntity as ExtendedEntity | ExtendedStudy;
  const inboxQuery = extendedEntity?.connectedInboxItems || "";
  const connectedObjects = extendedEntity?.connectedDocs || "";
  const connectedQueries = extendedEntity?.connectedQueries || "";
  const connectedComments = extendedEntity?.connectedComments || "";
  const connectedEntities = (extendedEntity?.entities || []).join(",");

  if (extendedEntity) {
    try {
      parsedDescription = JSON.parse(extendedEntity.description || "{}");
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
              <Dashboard
                type={"study"}
                id={id}
                title={extendedEntity?.title || ""}
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

export default Project;
