import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppWrapper from "./App";
import "@/styles/globals.scss";
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
