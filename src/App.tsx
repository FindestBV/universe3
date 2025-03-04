import { currentUser } from "@/api/auth/authSlice";
import { AppSidebar } from "@/components/common/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { persistor, store } from "@/store";
import { LoginPage } from "@/views/LoginPage";
import { PersistGate } from "redux-persist/integration/react";

import { lazy, useEffect, useRef } from "react";
import { Provider as ReduxStoreProvider, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
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
            <main className="pageContent">
              <Routes location={location}>
                {/* TEMP!! THIS WILL BE REFACTORED */}
                <Route path="/projects/dashboard" element={<Projects />} />
                <Route path="/projects/:id" element={<Project />} />
                <Route path="/pages" element={<Pages />} />
                <Route path="/pages/studies" element={<Pages />} />
                <Route path="/pages/studies/:id" element={<Page />} />
                <Route path="/sources" element={<Sources />} />
                <Route path="/sources/:id" element={<Source />} />
                <Route path="/pages/entities" element={<Pages />} />
                <Route path="/pages/entities/:id" element={<Page />} />
                <Route path="/queries" element={<AdvancedSearch />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="*" element={<NotFoundPage />} />
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
