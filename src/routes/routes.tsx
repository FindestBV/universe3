// src/routes.ts
import { Home, Queries, Document, Documents, Studies, Study, Entities, Entity, NotFoundPage } from './views';

export const routes = [
  { path: "/library/queries", element: <Queries /> },
  { path: "/library/overview", element: <Documents /> },
  { path: "/library/studies", element: <Studies /> },
  { path: "/library/studies/:id", element: <Study /> },
  { path: "/library/documents", element: <Documents /> },
  { path: "/library/documents/:id", element: <Document /> },
  { path: "/library/entities", element: <Entities /> },
  { path: "/library/entities/:id", element: <Entity /> },
  { path: "/", element: <Home /> },
  { path: "*", element: <NotFoundPage /> },
];

export default routes;