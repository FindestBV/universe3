// Imports
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useSelector, Provider as ReduxStoreProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import DashboardHeader from "@/components/dashboard-header";
import { store, persistor } from "@/store";
import { currentUser } from '@/services/auth/authSlice';
import { LoginPage } from "@/views/LoginPage";


// Lazy-loaded views (TEMP! Will sort this out with some proper Routing )
const Queries = lazy(() => import("@/views/Queries"));
const Documents = lazy(() => import("@/views/Documents"));
const Document = lazy(() => import("@/views/Document"));
const Studies = lazy(() => import("@/views/Studies"));
const Study = lazy(() => import("@/views/Study"));
const Entities = lazy(() => import("@/views/Entities"));
const Entity = lazy(() => import("@/views/Entity"));
const NotFoundPage = lazy(() => import("@/views/NotFound"));
const Dashboard = lazy(() => import("@/views/Dashboard"));
const Inbox = lazy(() => import("@/views/Inbox"));


// Protected routes
// @ts-expect-error blah
const ProtectedRoute = ({ children }) => {
  const user = useSelector(currentUser); // Get user from Redux
  const isAuthenticated = !!user; // Check if user exists
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  return children;
};

// Authenticated Layout
function AuthenticatedLayout() {
  const location = useLocation();


  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="app-canvas w-full">
        <DashboardHeader />
        <main className="flex flex-col items-center justify-start w-full h-full p-6">
          <SidebarTrigger className="absolute z-10 top-0 left-0" />
          <TransitionGroup component={null}>
            <CSSTransition key={location.key} classNames="fade" timeout={1000} unmountOnExit>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes location={location}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/library/queries" element={<Queries />} />
                  <Route path="/library/overview" element={<Documents />} />
                  <Route path="/library/studies" element={<Studies />} />
                  <Route path="/library/studies/:id" element={<Study />} />
                  <Route path="/library/documents" element={<Documents />} />
                  <Route path="/library/documents/:id" element={<Document />} />
                  <Route path="/library/entities" element={<Entities />} />
                  <Route path="/library/entities/:id" element={<Entity />} />
                  <Route path="/inbox" element={<Inbox />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </CSSTransition>
          </TransitionGroup>
        </main>
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
