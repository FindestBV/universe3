import * as Sentry from "@sentry/react";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "../src/styles/universe.scss";
import AppWrapper from "./App";
import "./i18n";

Sentry.init({
  dsn: "https://b8cbc4f0ddacc3f6153aff037e32e484@o4509089446166528.ingest.de.sentry.io/4509089495187536",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
);
