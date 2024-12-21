// Import the centralized base API
import type { SavedDocumentResponse } from "@/types/types";

import { api } from "../api";

export const activityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyRecentActivity: builder.query<SavedDocumentResponse, void>({
      query: () => ({
        url: "activity/mysimplerecent",
        params: {
          orderBy: 2,
          createdByMe: true,
        },
      }),
      providesTags: ["SavedDocument"],
    }),
    getMaxActivity: builder.query<SavedDocumentResponse, void>({
      query: () => ({
        url: "activity",
        params: {
          maxActivity: 10,
        },
      }),
      providesTags: ["SavedDocument"],
    }),
    getLinking: builder.query<SavedDocumentResponse, void>({
      query: () => ({
        url: "linking",
      }),
      providesTags: ["SavedDocument"],
    }),

    getLinkingDataByTitle: builder.query<SavedDocumentResponse, string | undefined>({
      query: (name) => ({
        url: "linking",
        params: name ? { name } : {}, // Pass `name` only if it's defined
      }),
      providesTags: ["SavedDocument"],
    }),

    getPageTypes: builder.query<SavedDocumentResponse, void>({
      query: () => ({
        url: "linking/types",
      }),
      providesTags: ["SavedDocument"],
    }),
    getMyRecentActivityDropdown: builder.query<SavedDocumentResponse, void>({
      query: () => ({
        url: "activity/my",
        // url: 'my/',
        params: {
          orderBy: 2,
          createdByMe: true,
        },
      }),
      providesTags: ["SavedDocument"],
    }),
  }),
});

export const {
  useGetMyRecentActivityQuery,
  useGetMaxActivityQuery,
  useGetLinkingQuery,
  useGetLinkingDataByTitleQuery,
  useGetPageTypesQuery,
  useGetMyRecentActivityDropdownQuery,
  usePrefetch,
} = activityApi;
