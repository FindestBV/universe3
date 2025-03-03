import { SavedDocumentResponse } from "@/types/types";
import { AnyAction, Middleware } from "@reduxjs/toolkit";

import { api } from "./api";

interface WebSocketMessage {
  type:
    | "PROJECT_UPDATE"
    | "PROJECT_PAGES_UPDATE"
    | "PROJECT_STRUCTURE_UPDATE"
    | "PROJECT_STATISTICS_UPDATE"
    | "PROJECT_NOTIFICATIONS_UPDATE";
  projectId: string;
  payload: SavedDocumentResponse;
}

interface WebSocketConnectAction extends AnyAction {
  type: "WS_CONNECT";
  payload: {
    url: string;
  };
}

const isWebSocketConnectAction = (action: AnyAction): action is WebSocketConnectAction => {
  return action.type === "WS_CONNECT" && typeof action.payload?.url === "string";
};

export const websocketMiddleware = (): Middleware => {
  let socket: WebSocket | null = null;
  let reconnectTimer: NodeJS.Timeout | null = null;
  const RECONNECT_INTERVAL = 5000;
  const MAX_RETRIES = 5;
  let retryCount = 0;

  const connect = (wsUrl: string): WebSocket => {
    if (socket?.readyState === WebSocket.OPEN) {
      return socket;
    }

    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
      retryCount = 0; // Reset retry count on successful connection
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      if (retryCount < MAX_RETRIES && reconnectTimer === null) {
        reconnectTimer = setTimeout(
          () => {
            retryCount++;
            connect(wsUrl);
            reconnectTimer = null;
          },
          RECONNECT_INTERVAL * Math.pow(2, retryCount),
        ); // Exponential backoff
      }
    };

    socket.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
    };

    return socket;
  };

  return (store) => (next) => (action: AnyAction) => {
    if (isWebSocketConnectAction(action)) {
      connect(action.payload.url);
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          const cacheUpdater = (draft: SavedDocumentResponse) => {
            return { ...draft, ...data.payload };
          };

          switch (data.type) {
            case "PROJECT_UPDATE":
              store.dispatch(
                api.util.updateQueryData("getProjectById", data.projectId, cacheUpdater),
              );
              break;

            case "PROJECT_PAGES_UPDATE":
              store.dispatch(
                api.util.updateQueryData("getProjectPages", data.projectId, cacheUpdater),
              );
              break;

            case "PROJECT_STRUCTURE_UPDATE":
              store.dispatch(
                api.util.updateQueryData("getProjectStructure", data.projectId, cacheUpdater),
              );
              break;

            case "PROJECT_STATISTICS_UPDATE":
              store.dispatch(
                api.util.updateQueryData("getProjectStatistics", data.projectId, cacheUpdater),
              );
              break;

            case "PROJECT_NOTIFICATIONS_UPDATE":
              store.dispatch(
                api.util.updateQueryData("getProjectNotifications", data.projectId, cacheUpdater),
              );
              break;

            default:
              console.warn("Unknown WebSocket message type:", data.type);
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };
    }

    return next(action);
  };
};
