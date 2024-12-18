// Auth
// Slices
import { activityApi } from "@/services/activity/activityApi";
import { authApi } from "@/services/auth/authApi";
import authSlice from "@/services/auth/authSlice";
import { documentApi } from "@/services/documents/documentApi";
import { entityApi } from "@/services/entities/entityApi";
import { searchApi } from "@/services/search/searchApi";
import { studyApi } from "@/services/study/studyApi";
import languageReducer from "@/services/utilities/languageSlice";
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

// Create the history context
const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: createBrowserHistory(),
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "language"], // Language must match key in combineReducers
};

// Combine reducers
export const rootReducer = combineReducers({
  router: routerReducer,
  auth: authSlice,
  entities: entityApi,
  activities: activityApi,
  search: searchApi,
  studies: studyApi,
  documents: documentApi,
  language: languageReducer,
  [authApi.reducerPath]: authApi.reducer,
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
      entityApi.middleware,
      activityApi.middleware,
      searchApi.middleware,
      studyApi.middleware,
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
