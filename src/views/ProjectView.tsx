import { store } from "@/store";

import React from "react";

import { useGetProjectByIdQuery } from "../api/projects/projectApi";
import { useProjectWebSocket } from "../hooks/useProjectWebSocket";

interface ProjectViewProps {
  projectId: string;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ projectId }) => {
  // Set up WebSocket connection
  useProjectWebSocket(projectId);

  // Use RTK Query hook - it will now receive WebSocket updates
  const { data: project, isLoading, error } = useGetProjectByIdQuery(projectId);

  if (isLoading) {
    return <div>Loading project...</div>;
  }

  if (error) {
    return <div>Error loading project</div>;
  }

  if (!project) {
    return <div>No project found</div>;
  }

  return (
    <div>
      <h1>{project.title}</h1>
      <div>
        <h2>Project Details</h2>
        <p>Status: {project.status}</p>
        <p>Last Updated: {new Date(project.updatedAt).toLocaleString()}</p>
      </div>

      {/* Add more project details as needed */}
    </div>
  );
};

// In your component or initialization code
store.dispatch({
  type: "WS_CONNECT",
  payload: {
    url: process.env.NEXT_PUBLIC_WS_URL,
  },
});
