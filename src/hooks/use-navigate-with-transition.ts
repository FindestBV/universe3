import { useNavigate } from "react-router-dom";

/**
 * A custom hook to handle navigation with the View Transitions API.
 * Falls back to normal navigation if the browser does not support the API.
 *
 * @returns A function to navigate with a transition.
 */
export const useNavigateWithTransition = (): ((to: string) => void) => {
  const navigate = useNavigate();

  /**
   * Navigates to the specified route with a View Transition effect.
   * @param to - The target route path to navigate to.
   */
  const navigateWithTransition = (to: string): void => {
    if (document.startViewTransition) {
      // If the browser supports the View Transitions API
      document.startViewTransition(() => {
        navigate(to); // Perform the navigation
      });
    } else {
      // Fallback for unsupported browsers
      navigate(to);
    }
  };

  return navigateWithTransition;
};

export default useNavigateWithTransition;
