import { currentUser } from "@/api/auth/authSlice";
import { AppSidebar } from "@/components/common/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { persistor, store } from "@/store";
import { LoginPage } from "@/views/LoginPage";
import NotFound from "@/views/NotFound";
import { PersistGate } from "redux-persist/integration/react";

import { lazy, useEffect, useRef } from "react";
import { Provider as ReduxStoreProvider, useSelector } from "react-redux";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

// Lazy-loaded views (TEMP! Will sort this out with some proper Routing )
const AdvancedSearch = lazy(() => import("@/views/AdvancedSearch"));
// const Dashboard = lazy(() => import("@/views/Dashboard"));
const Sources = lazy(() => import("@/views/Sources"));
const Source = lazy(() => import("@/views/Source"));
const Pages = lazy(() => import("@/views/Pages"));
const Page = lazy(() => import("@/views/Page"));
const Projects = lazy(() => import("@/views/Projects"));
const Project = lazy(() => import("@/views/Project"));
const NotFoundPage = lazy(() => import("@/views/NotFound"));
const Inbox = lazy(() => import("@/views/Inbox"));

// Protected routes
// @ts-expect-error blah
const ProtectedRoute = ({ children }) => {
  const user = useSelector(currentUser); // Get user from Redux
  const isAuthenticated = !!user; // Check if user exists
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

/**
 * Type definition for route configuration
 * Ensures consistent route object structure throughout the application
 */
type RouteConfig = {
  path: string; // URL path for the route
  component: React.ComponentType<any>; // Component to render for this route
  type?: "study" | "entity"; // Optional type for special page handling
  title?: string; // Optional title for navigation/breadcrumbs
};

/**
 * Application route definitions
 * Each route object defines how a specific URL path should be handled
 * Routes are ordered by specificity (more specific routes first)
 */
const routes: RouteConfig[] = [
  { path: "/projects/dashboard", component: Projects, title: "Projects" },
  { path: "/projects/:id", component: Project, title: "Project Details" },
  { path: "/pages", component: Pages, title: "Pages" },
  { path: "/pages/studies", component: Pages, title: "Studies" },
  // Special case: Study pages require additional type prop for query handling
  { path: "/pages/studies/:id", component: Page, type: "study", title: "Study Details" },
  { path: "/sources", component: Sources, title: "Sources" },
  { path: "/sources/:id", component: Source, title: "Source Details" },
  { path: "/pages/entities", component: Pages, title: "Entities" },
  // Special case: Entity pages require additional type prop for query handling
  { path: "/pages/entities/:id", component: Page, type: "entity", title: "Entity Details" },
  { path: "/queries", component: AdvancedSearch, title: "Advanced Search" },
  { path: "/inbox", component: Inbox, title: "Inbox" },
  { path: "*", component: NotFoundPage, title: "Not Found" },
];

/**
 * Props interface for the RenderComponent
 * Defines the expected props and their types
 */
type RenderComponentProps = {
  component: React.ComponentType<any>; // Component to be rendered
  type?: "study" | "entity"; // Optional type for special page handling
};

/**
 * RenderComponent handles the actual rendering of route components
 * It manages special cases for study and entity pages by passing additional props
 */
const RenderComponent: React.FC<RenderComponentProps> = ({ component: Component, type }) => {
  const { id } = useParams(); // Get URL parameters
  // Conditionally render with type and id props for study/entity pages
  return type ? <Component pageType={type} id={id} /> : <Component />;
};

/**
 * AuthenticatedLayout provides the main application structure
 * Includes sidebar, navigation, and page transitions
 * Note: Likely to not be last pass over this.
 * TODO: validate against inadvertent race conditions.
 */
function AuthenticatedLayout() {
  const location = useLocation();
  // Properly typed ref for CSSTransition
  const nodeRef = useRef<HTMLElement>(null);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="app-canvas w-full">
        {/* Handle page transition animations */}
        <TransitionGroup component={null}>
          <CSSTransition key={location.key} classNames="fade" timeout={1000} nodeRef={nodeRef}>
            <main className="pageContent" ref={nodeRef}>
              {/* Dynamic route rendering based on configuration */}
              <Routes location={location}>
                {routes.map(({ path, component, type }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <RenderComponent
                        component={component}
                        {...(type && { type })} // Conditionally spread type prop
                      />
                    }
                  />
                ))}
              </Routes>
            </main>
          </CSSTransition>
        </TransitionGroup>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}

// Main App component
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Top-level wrapper
function AppWrapper() {
  return (
    <ReduxStoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter future={{ v7_startTransition: true }}>
          <App />
        </BrowserRouter>
      </PersistGate>
    </ReduxStoreProvider>
  );
}

export default AppWrapper;
