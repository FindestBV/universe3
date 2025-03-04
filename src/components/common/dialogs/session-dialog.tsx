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
 * - **Redux Toolkit Query**: Fetches recent activity using `useGetMyRecentActivityQuery()`.
 * - **Lucide Icons**: ChevronRight, Loader.
 * - **React Hooks**: `useState`, `useEffect` for managing dialog state.
 * - **Custom Hooks**: `useNavigateWithTransition` for smooth navigation.
 *
 * @returns {JSX.Element} The rendered SessionDialog component.
 */
import { useGetMyRecentActivityQuery } from "@/api/activity/activityApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigateWithTransition } from "@/hooks/use-navigate-with-transition";
import { ChevronRight, Loader } from "lucide-react";

import { useEffect, useState } from "react";

import { CreateProjectDialog } from "./create-project-dialog";

export const SessionDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { data: activityData, isLoading: activityDataIsLoading } = useGetMyRecentActivityQuery();
  const navigateWithTransition = useNavigateWithTransition();

  const handleNavigateToEntities = (type: string, id: string) => {
    navigateWithTransition(`/projects/${id}`, { state: { id } });
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
          </DialogHeader>
          <h2>What project do you want to focus on today?</h2>

          <div className="recent_projects">
            <h3 className="title">Recent projects</h3>

            <div className="projects_container">
              {activityDataIsLoading ? (
                <div className="activity_loader">
                  <Loader className="animate-spin text-gray-600" />
                  <p className="loadingText">Loading Activity Data...</p>
                </div>
              ) : (
                activityData?.slice(0, 3).map((activity: any) => (
                  <div
                    key={activity.id}
                    className="activity_list bg-slate-200"
                    onClick={() => handleNavigateToEntities(activity.type, activity.id)}
                  >
                    <div className="item">
                      <h3 className="text-sm font-semibold">
                        {activity.name.length > 80
                          ? `${activity.name.slice(0, 80)}...`
                          : activity.name}
                      </h3>
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
