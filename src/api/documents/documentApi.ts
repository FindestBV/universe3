// src/features/documentApi.ts
import type { ConnectedObject, SavedDocumentResponse } from "@/types/types";

import { api } from "../api";

interface Document {
  id: string;
  url: string;
  title: string;
  type: string;
  abstract: string;
}

export const documentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSavedDocuments: builder.query<SavedDocumentResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: "saveddocument",
        params: {
          orderBy: 2,
          doIncludePatents: true,
          doIncludeScienceArticles: true,
          doIncludeWeblinks: true,
          createdByMe: true,
          page,
          limit,
        },
      }),
      providesTags: ["SavedDocument"],
    }),

    getDocumentById: builder.query<SavedDocumentResponse, string>({
      query: (id) => `saveddocument/${id}`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    getConnectedObjects: builder.query<ConnectedObject[], { id: string; type: string }>({
      query: ({ id, type }) => `linking/${id}?objectType[]=${type}`,
    }),

    addDocument: builder.mutation<void, Document>({
      query: (newDocument) => ({
        url: "saveddocument",
        method: "POST",
        body: newDocument,
      }),
      invalidatesTags: ["SavedDocument"],
    }),

    deleteDocument: builder.mutation<void, string>({
      query: (id) => ({
        url: `saveddocument/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SavedDocument"],
    }),

    getMyDocumentInbox: builder.query<SavedDocumentResponse, string>({
      query: () => ({
        url: "saveddocument/my",
        params: {
          orderBy: 2,
          doIncludePatents: true,
          doIncludeScienceArticles: true,
          doIncludeWeblinks: true,
          doExcludeLinks: false,
          createdByMe: true,
        },
      }),
      providesTags: ["SavedDocument"],
    }),
  }),
});

export const {
  useGetSavedDocumentsQuery,
  useGetDocumentByIdQuery,
  useGetMyDocumentInboxQuery,
  useLazyGetConnectedObjectsQuery,
  useAddDocumentMutation,
  useDeleteDocumentMutation,
  usePrefetch,
} = documentApi;
