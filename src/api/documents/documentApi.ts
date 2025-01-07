// src/features/documentApi.ts
import type { ConnectedObject, Entity, SavedDocumentResponse, Study } from "@/types/types";

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

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          // Wait for the article query to finish
          const { data: document } = await queryFulfilled;
          // Trigger dependent queries for connected inbox items
          if (document?.id) {
            console.log("triggered from query started", document.id);
            console.log(
              "dispatching getDocumentRelatedScienceArticles from query started",
              document.id,
            );
            dispatch(api.endpoints?.getDocumentRelatedScienceArticles.initiate(document.id));
            console.log("dispatching getConnectedObjects from query started", document.id);
            dispatch(api.endpoints?.getConnectedObjects.initiate(document.id!));
          }
        } catch (error) {
          console.error("Error in onQueryStarted for getDocument:", error);
        }
      },
    }),

    getDocumentRelatedScienceArticles: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/document/sciencearticle/${id}/relatedsciencearticles`,
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
          createdByMe: false,
        },
      }),
      providesTags: ["SavedDocument"],
    }),

    // Entities

    getEntities: builder.query<Entity[], void>({
      query: () => ({
        url: "entity",
        params: {
          orderBy: 2,
          createdByMe: false,
        },
      }),
    }),

    getEntityById: builder.query<SavedDocumentResponse, void>({
      query: (id) => ({
        url: `entity/${id}`,
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          // Wait for the article query to finish
          const { data: entity } = await queryFulfilled;
          // Trigger dependent queries for connected inbox items
          if (entity?.id) {
            console.log("triggered from query started", entity.id);
            console.log("dispatching getConnectedInboxItems from query started", entity.id);
            dispatch(api.endpoints?.getConnectedInboxItems.initiate(entity.id));
            console.log("dispatching get Connected Objects from query", entity.id);
            dispatch(api.endpoints?.getEntityConnectedDocs.initiate(entity.id));
            console.log("dispatching getEntityConnectedQueries from query started", entity.id);
            dispatch(api.endpoints?.getEntityConnectedQueries.initiate(entity.id));
            console.log("dispatching getSideBarDocuments from query started", entity.id);
            dispatch(api.endpoints?.getSideBarDocuments.initiate(entity.id));
          }
        } catch (error) {
          console.error("Error in onQueryStarted for getArticle:", error);
        }
      },
    }),

    updateEntityTitle: builder.mutation<Entity, { id: number; title: string }>({
      query: ({ id, title }) => ({
        url: `/${id}/title`,
        method: "PUT",
        body: { title },
      }),
    }),

    // Entity Connected Docs
    // TODO: generalise type to merge this with Study
    getEntityConnectedDocs: builder.query<Entity[], void>({
      query: (id) => ({
        url: `entity/${id}/saveddocuments?orderBy=2&doIncludePatents=true&doIncludeScienceArticles=true&doIncludeWeblinks=true`,
      }),
    }),

    // Connected Entity Queries (linked to id)
    getEntityConnectedQueries: builder.query<Entity[], void>({
      query: (id) => ({
        url: `entity/${id}/queries`,
      }),
    }),

    // Connected Comments (linked to id)
    getEntityConnectedComments: builder.query<Entity[], void>({
      query: (id) => ({
        url: `v2/comment/1/${id}`,
      }),
    }),

    // Connected Inbox Items
    getConnectedInboxItems: builder.query<Entity[], void>({
      query: (id) => ({
        url: `reference/inbox?connectedToObjectId=${id}`,
      }),
    }),

    // Sidebar Document List
    getSideBarDocuments: builder.query<SavedDocumentResponse[], void>({
      query: (id) => ({
        url: `reference/documents?connectedToObjectId=${id}`,
        params: {
          doOnlyGetConnectedToObjectId: true,
        },
      }),
      providesTags: ["SavedDocument"],
    }),

    getStudies: builder.query<
      { studies: Study[]; totalItems: number; totalPages: number; page: number },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: "study",
        params: {
          orderBy: 2,
          createdByMe: false,
          page,
          limit,
        },
      }),
    }),
    getStudyById: builder.query<Study, void>({
      query: (id) => ({
        url: `study/${id}`,
      }),
    }),
  }),
});

export const {
  useGetSavedDocumentsQuery,
  useGetDocumentByIdQuery,
  useGetDocumentRelatedScienceArticlesQuery,
  useGetMyDocumentInboxQuery,
  useGetSideBarDocumentsQuery,
  useGetConnectedObjectsQuery,
  useLazyGetConnectedObjectsQuery,
  useAddDocumentMutation,
  useDeleteDocumentMutation,
  useGetEntitiesQuery,
  useGetEntityByIdQuery,
  useGetStudiesQuery,
  useGetStudyByIdQuery,
  useGetConnectedInboxItemsQuery,
  useGetEntityConnectedDocsQuery,
  useGetEntityConnectedQueriesQuery,
  useGetEntityConnectedCommentsQuery,
  usePrefetch,
} = documentApi;
