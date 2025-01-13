import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "../src/styles/universe.scss";
import AppWrapper from "./App";
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
);
