// Imports
import { currentUser } from "@/api/auth/authSlice";
// import { DashboardHeader } from "@/components/common/layout/dashboard-header";
import { AppSidebar } from "@/components/common/sidebar/v2/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { persistor, store } from "@/store";
import Dashboard from "@/views/Dashboard";
import { LoginPage } from "@/views/LoginPage";
import { PersistGate } from "redux-persist/integration/react";

import { useEffect, useRef } from "react";
import { lazy } from "react";
import { Provider as ReduxStoreProvider, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

// Lazy-loaded views (TEMP! Will sort this out with some proper Routing )
const AdvancedSearch = lazy(() => import("@/views/AdvancedSearch"));
const Sources = lazy(() => import("@/views/Sources"));
const Source = lazy(() => import("@/views/Source"));
const Resources = lazy(() => import("@/views/Resources"));
const Documents = lazy(() => import("@/views/Documents"));
const Settings = lazy(() => import("@/views/Settings"));
const Studies = lazy(() => import("@/views/Studies"));
const Pages = lazy(() => import("@/views/Pages"));
const Page = lazy(() => import("@/views/Page"));
const Project = lazy(() => import("@/views/Project"));
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
                <Route path="/overview" element={<Documents />} />
                <Route path="/projects/:id" element={<Project />} />
                <Route path="/pages" element={<Pages />} />
                <Route path="/pages/studies" element={<Studies />} />
                <Route path="/pages/studies/:id" element={<Page />} />
                <Route path="/sources" element={<Sources />} />
                <Route path="/sources/:id" element={<Source />} />
                <Route path="/pages/entities" element={<Pages />} />
                <Route path="/pages/entities/:id" element={<Page />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/queries" element={<AdvancedSearch />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            {/* </Suspense> */}
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
