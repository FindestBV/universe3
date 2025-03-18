// Slices
import { activityApi } from "@/api/activity/activityApi";
import { authApi } from "@/api/auth/authApi";
import authSlice from "@/api/auth/authSlice";
import { documentApi } from "@/api/documents/documentApi";
import documentSlice from "@/api/documents/documentSlice";
import { projectApi } from "@/api/projects/projectApi";
import { searchApi } from "@/api/search/searchApi";
import { treeApi } from "@/api/tree/treeApi";
import languageReducer from "@/api/utilities/languageSlice";
import sidebarReducer from "@/api/utilities/sidebarSlice";
// Import new API slice
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
  whitelist: ["auth", "language", "sidebar", "document"], // Add "document"
};

// Combine reducers
export const rootReducer = combineReducers({
  router: routerReducer,
  auth: authSlice,
  activities: activityApi,
  projects: projectApi,
  search: searchApi,
  advancedSearch: advancedSearchSlice,
  document: documentSlice,
  language: languageReducer,
  sidebar: sidebarReducer,
  [authApi.reducerPath]: authApi.reducer,
  [documentApi.reducerPath]: documentApi.reducer,
  [treeApi.reducerPath]: treeApi.reducer, // Add tree API reducer
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
      treeApi.middleware, // Add tree API middleware
      routerMiddleware,
    ),
});

// Type definitions
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Setup RTK Query listeners
setupListeners(store.dispatch);

// Persistor and History
export const persistor = persistStore(store);
export const history = createReduxHistory(persistor);

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
