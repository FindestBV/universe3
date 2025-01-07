// src/features/documentApi.ts
import type {
  ConnectedObject,
  Entity,
  SavedDocument,
  SavedDocumentResponse,
  Study,
} from "@/types/types";

import { api } from "../api";

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
          const { data: document } = await queryFulfilled;
          const scienceArticles = await dispatch(
            api.endpoints?.getDocumentRelatedScienceArticles.initiate(document.id),
          ).unwrap();
          dispatch(
            api.util.updateQueryData("getDocumentById", id, (draft) => {
              draft.scienceArticles = scienceArticles;
            }),
          );
        } catch (error) {
          console.error("Error in onQueryStarted for getEntityById:", error);
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

    // Document Inbox Items

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

    // Get Entities: gets all entities for display on Entities index
    getEntities: builder.query<Entity[], void>({
      query: () => ({
        url: "entity",
        params: {
          orderBy: 2,
          createdByMe: false,
        },
      }),
    }),

    // Get Entity By Id: gets a specific entity by Id and chain subsequent queries, appending to the main
    // fetchedEntity object
    getEntityById: builder.query<Entity, void>({
      query: (id) => ({
        url: `entity/${id}`,
      }),

      async onQueryStarted(id, { dispatch }) {
        try {
          const inboxItems = await dispatch(
            api.endpoints.getConnectedInboxItems.initiate(id),
          ).unwrap();
          const connectedDocs = await dispatch(
            api.endpoints.getEntityConnectedDocs.initiate(id),
          ).unwrap();
          const connectedQueries = await dispatch(
            api.endpoints.getEntityConnectedQueries.initiate(id),
          ).unwrap();
          const connectedComments = await dispatch(
            api.endpoints.getEntityConnectedComments.initiate(id),
          ).unwrap();

          dispatch(
            api.util.updateQueryData("getEntityById", id, (draft) => {
              draft.connectedInboxItems = inboxItems;
              draft.connectedDocs = connectedDocs;
              draft.connectedQueries = connectedQueries;
              draft.connectedComments = connectedComments;
            }),
          );
        } catch (error) {
          console.error("Error in onQueryStarted for getEntityById:", error);
        }
      },
    }),

    // N/A yet

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

    // Studies
    // GetStudies - get all studies

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
