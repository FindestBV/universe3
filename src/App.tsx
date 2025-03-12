import { currentUser } from "@/api/auth/authSlice";
import { AppSidebar } from "@/components/common/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { persistor, store } from "@/store";
import { LoginPage } from "@/views/LoginPage";
import { PersistGate } from "redux-persist/integration/react";

import { lazy, Suspense, useEffect, useMemo } from "react";
import { Provider as ReduxStoreProvider, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

// Lazy-loaded views
const componentMap: Record<string, React.LazyExoticComponent<any>> = {
  "/projects/dashboard": lazy(() => import("@/views/Projects")),
  "/projects/:id": lazy(() => import("@/views/Project")),
  "/pages": lazy(() => import("@/views/Pages")),
  "/pages/studies": lazy(() => import("@/views/Pages")),
  "/pages/studies/:id": lazy(() => import("@/views/Page")),
  "/sources": lazy(() => import("@/views/Sources")),
  "/sources/:id": lazy(() => import("@/views/Source")),
  "/pages/entities": lazy(() => import("@/views/Pages")),
  "/pages/entities/:id": lazy(() => import("@/views/Page")),
  "/queries": lazy(() => import("@/views/AdvancedSearch")),
  "/inbox": lazy(() => import("@/views/Inbox")),
  "*": lazy(() => import("@/views/NotFound")),
};

// Dynamic render component
const RenderComponent = () => {
  const location = useLocation();
  const Component = useMemo(() => {
    return (
      Object.entries(componentMap).find(([key]) =>
        location.pathname.match(new RegExp(`^${key.replace(/:\w+/g, "\\w+")}$`)),
      )?.[1] || componentMap["*"]
    );
  }, [location.pathname]);

  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <Component />
    </Suspense>
  );
};

// Protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector(currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  return user ? <>{children}</> : null;
};

// Authenticated Layout
const AuthenticatedLayout = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="app-canvas w-full">
        <TransitionGroup component={null}>
          <CSSTransition key={location.key} classNames="fade" timeout={500}>
            <main className="pageContent">
              <RenderComponent />
            </main>
          </CSSTransition>
        </TransitionGroup>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};

// Main App component
const App = () => {
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
    </Routes>
  );
};

// Top-level wrapper
const AppWrapper = () => {
  return (
    <ReduxStoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter future={{ v7_startTransition: true }}>
          <App />
        </BrowserRouter>
      </PersistGate>
    </ReduxStoreProvider>
  );
};

export default AppWrapper;
