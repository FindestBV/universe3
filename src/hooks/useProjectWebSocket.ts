import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { projectApi } from "../api/projects/projectApi";

export const useProjectWebSocket = (projectId: string) => {
  const dispatch = useDispatch();
  const [subscribeToProject] = projectApi.useSubscribeToProjectMutation();

  useEffect(() => {
    if (!projectId) return;

    // Subscribe to project updates
    const subscription = subscribeToProject(projectId)
      .unwrap()
      .catch((error) => {
        console.error("Failed to subscribe to project:", error);
      });

    return () => {
      // Cleanup subscription when component unmounts
      dispatch(projectApi.util.unsubscribe("subscribeToProject", projectId));
    };
  }, [projectId, dispatch, subscribeToProject]);
};
