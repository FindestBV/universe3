import type { SavedDocumentResponse } from "@/types/types";

import { api } from "../api";

export const searchApi = api.injectEndpoints({
  endpoints: (builder) => ({
    searchItems: builder.mutation<SavedDocumentResponse, string>({
      query: (query) => `search/searchbar?query=${query}&api-version=2.0`,
    }),
    searchDataPageItems: builder.mutation<SavedDocumentResponse, string>({
      query: (query) => `search/searchbar?query=${query}&api-version=2.0`,
    }),
    advancedSearch: builder.query<SavedDocumentResponse, string>({
      query: () => ({
        url: "/query",
        params: {
          orderBy: 2,
          isCreatedByMe: false,
        },
      }),
      providesTags: ["SavedDocument"],
    }),
  }),
  overrideExisting: process.env.NODE_ENV === "development", // This allows overrides only in development mode.
});

export const {
  useSearchItemsMutation,
  useAdvancedSearchQuery,
  useSearchDataPageItemsMutation,
  usePrefetch,
} = searchApi;
