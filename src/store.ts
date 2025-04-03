// Slices
import { activityApi } from "@/api/activity/activityApi";
import { api } from "@/api/api";
import { authApi } from "@/api/auth/authApi";
import authSlice from "@/api/auth/authSlice";
import { documentApi } from "@/api/documents/documentApi";
import documentSlice from "@/api/documents/documentSlice";
import { projectApi } from "@/api/projects/projectApi";
import projectSlice from "@/api/projects/projectSlice";
import { searchApi } from "@/api/search/searchApi";
import { treeApi } from "@/api/tree/treeApi";
import languageReducer from "@/api/utilities/languageSlice";
import sidebarReducer from "@/api/utilities/sidebarSlice";
// Configure Store and Persistance
import { configureStore, Reducer } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { createBrowserHistory } from "history";
import { combineReducers } from "redux";
import { createReduxHistoryContext } from "redux-first-history";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Type-safe hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { advancedSearchSlice } from "./api/search/advancedSearchSlice";

// Create the history context
const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: createBrowserHistory(),
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "language", "sidebar", "document", "project"], // Added project to whitelist
};

// Combine reducers
export const rootReducer = combineReducers({
  router: routerReducer,
  auth: authSlice,
  project: projectSlice,
  document: documentSlice,
  language: languageReducer,
  sidebar: sidebarReducer,
  advancedSearch: advancedSearchSlice,
  // API reducer
  api: api.reducer,
}) as Reducer;

// Persist the combined reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
        ignoredPaths: ["router.location.key"],
      },
    }).concat(
      authApi.middleware,
      documentApi.middleware,
      activityApi.middleware,
      searchApi.middleware,
      projectApi.middleware,
      treeApi.middleware,
      routerMiddleware,
    ),
});

// Type definitions
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Setup RTK Query listeners
setupListeners(store.dispatch);

// Create history after store is created
export const history = createReduxHistory(store);
// Create persistor after store is created
export const persistor = persistStore(store);

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
