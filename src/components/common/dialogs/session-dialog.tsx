/**
 * SessionDialog Component
 *
 * This component triggers a **session-based dialog** after a short interval (default: **2 seconds**)
 * when the user loads the dashboard. It prompts the user to **select a project to focus on**
 * or create a new one.
 *
 * ## Features:
 * - **Automatically opens after a delay** upon dashboard load.
 * - **Displays recent projects** from the user's activity data.
 * - **Allows users to navigate to a selected project** or create a new one.
 * - **Dismissable dialog** with a future flag to remember user preference.
 * - **Handles loading states** while fetching activity data.
 *
 * ## Customization:
 * - **Modify the trigger delay** in the `useEffect` timeout (`2000ms` by default).
 * - **Update the navigation logic** inside `handleNavigateToEntities`.
 * - **Customize dialog messages** to match user workflows.
 * - **Integrate persistent dismissal flag** to prevent reopening if dismissed.
 *
 * @component
 * @example
 * <SessionDialog />
 *
 * @dependencies
 * - **ShadCN UI Components**: Dialog, DialogTrigger, DialogContent, DialogTitle.
 * - **Redux Toolkit Query**: Fetches recent activity using `useGetRecentProjectsQuery()`.
 * - **Lucide Icons**: ChevronRight, Loader.
 * - **React Hooks**: `useState`, `useEffect` for managing dialog state.
 * - **Custom Hooks**: `useNavigateWithTransition` for smooth navigation.
 *
 * @returns {JSX.Element} The rendered SessionDialog component.
 */
import { useGetRecentProjectsQuery } from "@/api/projects/projectApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigateWithTransition } from "@/hooks/use-navigate-with-transition";
import { use } from "i18next";
import { ChevronRight, Loader } from "lucide-react";

import { useEffect, useState } from "react";

import { CreateProjectDialog } from "./create-project-dialog";

export const SessionDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { data: recentProjects, isLoading: projectsLoading } = useGetRecentProjectsQuery();
  const navigateWithTransition = useNavigateWithTransition();

  const handleNavigateToProject = (projectId: string) => {
    navigateWithTransition(`/projects/${projectId}`);
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDialogOpen(true);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  return (
    <>
      {/* Confirmation Dialog */}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sessionDialog bg-white">
          <DialogHeader>
            <DialogTitle>Good morning!</DialogTitle>
            <div id="dialog-description" className="sr-only">
              Please select a project to focus on
            </div>
          </DialogHeader>

          <h2>What project do you want to focus on today?</h2>

          <div className="recent_projects">
            <h3 className="title">Recent projects</h3>

            <div className="projects_container">
              {projectsLoading ? (
                <div className="activity_loader">
                  <Loader className="animate-spin text-gray-600" />
                  <p className="loadingText">Loading Recent Projects...</p>
                </div>
              ) : (
                recentProjects?.map((project) => (
                  <div
                    key={project.id}
                    className="activity_list cursor-pointer bg-slate-200 hover:bg-slate-300"
                    onClick={() => handleNavigateToProject(project.id)}
                  >
                    <div className="item">
                      <h3 className="text-sm font-semibold">
                        {project.name && project.name.length > 80
                          ? `${project.name.slice(0, 80)}...`
                          : project.name}
                      </h3>
                      {project.description && (
                        <p className="text-xs text-gray-600">
                          {project.description.length > 100
                            ? `${project.description.slice(0, 100)}...`
                            : project.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="icon" />
                  </div>
                ))
              )}
            </div>
          </div>
          <CreateProjectDialog title={"Create a new project"} />
          <button
            type="submit"
            className="max-w-[200px] rounded-md bg-black p-2 text-sm text-white hover:bg-slate-500 focus:outline-none"
            onClick={() => setIsDialogOpen(false)}
          >
            No projects today
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SessionDialog;
