// Imports
import { currentUser } from "@/api/auth/authSlice";
import { DashboardHeader } from "@/components/shared/layout/dashboard-header";
import { AppSidebar } from "@/components/shared/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { persistor, store } from "@/store";
import Dashboard from "@/views/Dashboard";
import { LoginPage } from "@/views/LoginPage";
import { PersistGate } from "redux-persist/integration/react";

import { useEffect, useRef } from "react";
import { lazy } from "react";
import { Provider as ReduxStoreProvider, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Admin from "./views/Admin";

// Lazy-loaded views (TEMP! Will sort this out with some proper Routing )
const Queries = lazy(() => import("@/views/Queries"));
const Documents = lazy(() => import("@/views/Documents"));
const Document = lazy(() => import("@/views/Document"));
const Resources = lazy(() => import("@/views/Resources"));
const Settings = lazy(() => import("@/views/Settings"));
const Studies = lazy(() => import("@/views/Studies"));
const Study = lazy(() => import("@/views/Study"));
const Entities = lazy(() => import("@/views/Entities"));
const Entity = lazy(() => import("@/views/Entity"));
const NotFoundPage = lazy(() => import("@/views/NotFound"));
const DataView = lazy(() => import("@/views/DataView"));
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

// Authenticated Layout
function AuthenticatedLayout() {
  const location = useLocation();
  const nodeRef = useRef();
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="app-canvas w-full">
        <DashboardHeader />

        <TransitionGroup component={null}>
          <CSSTransition key={location.key} classNames="fade" timeout={1000} nodeRef={nodeRef}>
            {/* <Suspense
              fallback={
                <div className="flex h-screen flex-col items-center justify-center py-8 text-center">
                  <Loader className="mx-auto mb-2 animate-spin" />
                  <h3 className="text2-xl font-black">Loading</h3>
                </div>
              }
            > */}
            <main className="pageContent">
              <Routes location={location}>
                {/* TEMP!! THIS WILL BE REFACTORED */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/library/queries" element={<Queries />} />
                <Route path="/library/overview" element={<Documents />} />
                <Route path="/library/studies" element={<Studies />} />
                <Route path="/library/studies/:id" element={<Study />} />
                <Route path="/library/documents" element={<Documents />} />
                <Route path="/library/documents/:id" element={<Document />} />
                <Route path="/library/entities" element={<Entities />} />
                <Route path="/library/entities/:id" element={<Entity />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/user/settings" element={<Settings />} />
                <Route path="/dataview" element={<DataView />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            {/* </Suspense> */}
          </CSSTransition>
        </TransitionGroup>
      </div>
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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// Top-level wrapper
function AppWrapper() {
  return (
    <ReduxStoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </ReduxStoreProvider>
  );
}

export default AppWrapper;
