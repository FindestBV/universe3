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
      query: (query) => ({
        url: "/query",
        params: {
          query: query === "default" ? "" : query,
        },
      }),
      providesTags: ["SavedDocument"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: initialResponse } = await queryFulfilled;

          // Check if we have the required IDs in the response
          if (initialResponse?.documents?.length > 0) {
            // Get all document IDs from the response
            const documentIds = initialResponse.documents.map((doc) => doc.id).filter(Boolean);

            // Make follow-up queries for each document
            const detailedResponses = await Promise.all(
              documentIds.map((id) =>
                dispatch(searchApi.endpoints.advancedSearchById.initiate(id)).unwrap(),
              ),
            );

            // Update the cache with the detailed information
            dispatch(
              searchApi.util.updateQueryData("advancedSearch", arg, (draft) => {
                if (draft?.documents) {
                  draft.documents = draft.documents.map((doc, index) => ({
                    ...doc,
                    ...detailedResponses[index]?.documents?.[0],
                  }));
                }
              }),
            );
          }
        } catch (error) {
          console.error("Error in advancedSearch onQueryStarted:", error);
        }
      },
    }),
    advancedSearchById: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/query/${id}`,
    }),
  }),
  overrideExisting: process.env.NODE_ENV === "development", // This allows overrides only in development mode.
});

export const {
  useSearchItemsMutation,
  useAdvancedSearchQuery,
  useAdvancedSearchByIdQuery,
  useSearchDataPageItemsMutation,
  usePrefetch,
} = searchApi;
