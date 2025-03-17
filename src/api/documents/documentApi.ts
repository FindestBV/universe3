// src/features/documentApi.ts
import type { ConnectedObject, Entity, SavedDocumentResponse, Study } from "@/types/types";

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

    /* 
      Get Document By Id: gets a specific document by Id and chain subsequent queries, appending to the main query. 

      What is happening here ?
      Documents are hydrated by a several queries, which are each dispatched with a common parameter - the document id. 
      On the Document.tsx view, as single call is made to the getDocumentById query, 
    
      Here, we're using OnQueryStarted to dispatch the subsequent queries, which hiterto returned an object via a separate call.    
      Note: a similar strategy is employed for Entities/Studies, as illustrated below. 

    */

    getDocumentById: builder.query<SavedDocumentResponse, string>({
      query: (id) => `saveddocument/${id}`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],

      // onQuery started:
      // Dispatches the other queries
      // Note: ".unwrap" - this will return a new promise which contains the *actual* action to be executed.
      // The builder query must still be defined on the api slice.

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const { data: document } = await queryFulfilled.catch(() => null);
        if (!document) return;

        const scienceArticles = await dispatch(
          api.endpoints?.getDocumentRelatedScienceArticles.initiate(document.id),
        )
          .unwrap()
          .catch(() => null);

        const attachedFiles = await dispatch(api.endpoints.getAttachedFiles.initiate(id))
          .unwrap()
          .catch(() => null);

        dispatch(
          api.util.updateQueryData("getDocumentById", id, (draft) => {
            draft.scienceArticles = scienceArticles ?? [];
            draft.attachedFiles = attachedFiles ?? [];
          }),
        );
      },
    }),

    getDocumentRelatedScienceArticles: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/document/sciencearticle/${id}/relatedsciencearticles`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    getConnectedObjects: builder.query<ConnectedObject[], { id: string; type: number }>({
      query: ({ id, type }) => {
        let endpoint = "";

        switch (type) {
          case 1:
            endpoint = `linking/${id}?objectType[]=1`;
            break;
          case 2:
            endpoint = `saveddocument/linkedto/${id}`;
            break;
          case 3:
            endpoint = `savedfile/linkedto/${id}`;
            break;
          case 4:
            endpoint = `image/linkedto/${id}`;
            break;
          case 5:
            endpoint = `image/linkedto/${id}`;
            break;
          case 6:
            endpoint = `sciencearticle/linkedto/${id}`;
            break;
          case 7:
            endpoint = `uspatent/linkedto/${id}`;
            break;
          case 8:
            endpoint = `weblink/linkedto/${id}`;
            break;
          case 9:
            endpoint = `magpatent/linkedto/${id}`;
            break;
          case 10:
            endpoint = `comment/linkedto/${id}`;
            break;
          case 11:
            endpoint = `file/linkedto/${id}`;
            break;
          default:
            throw new Error(`Invalid type: ${type}`);
        }

        return {
          url: endpoint,
        };
      },
      providesTags: (result, error, { id, type }) => [
        { type: "ConnectedObject", id, subtype: type },
      ],
    }),

    getAttachedFiles: builder.query<ConnectedObject[], { id: string }>({
      query: (id) => `savedfile/linkedto/${id}`,
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

    // INITIAL. BELOW IS A WIP.

    /* DRAFT FUNCTIONALITY - EXPERIMENTAL (DISABLED)
    To re-enable:
    1. Implement proper API endpoints
    2. Remove skip: true from queries
    3. Update URLs to point to proper API
    4. Update types and error handling
    
    createDraft: builder.mutation({
      query: (initialData: { content?: string; createdAt?: string }) => {
        const payload = {
          content: initialData.content || "Default/FB content",
          createdAt: initialData.createdAt || new Date().toISOString(),
        };
        return {
          url: "draft", // TODO: implement proper endpoint
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["Draft"],
    }),

    updateDraft: builder.mutation({
      query: ({ id, content, updatedAt }: { id: string; content: string; updatedAt: string }) => ({
        url: `draft/${id}`, // TODO: implement proper endpoint
        method: "PUT",
        body: { content, updatedAt },
      }),
      async onQueryStarted({ id, content, updatedAt }, { dispatch, queryFulfilled }) {
        if (!id) {
          console.error("No ID provided to update the draft");
          return;
        }
        const patchedResult = dispatch(
          api.util.updateQueryData("fetchDraft", id, (draft: any) => {
            if (draft) {
              draft.content = content;
              draft.updatedAt = updatedAt;
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to update draft:", error);
          patchedResult.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Draft", id }],
    }),

    fetchDraft: builder.query({
      query: (id: string) => `draft/${id}`, // TODO: implement proper endpoint
      providesTags: (result, error, id) => [{ type: "Draft", id }],
    }),
    */

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

    /* 
      Get Entity By Id: gets a specific entity by Id and chain subsequent queries, appending to the main query. 

      What is happening here ?
      Entities are hydrated by a range of builder queries, which are each dispatched with a common parameter - the entity id. 
      On the Entity.tsx component, as single call is made to the getEntityById query, 
    
      Here, we're using OnQueryStarted to dispatch the subsequent queries, which hiterto returned an object via a separate cal.     
    */

    getEntityById: builder.query<Entity, void>({
      // Main request. Gets the Entity by Id

      query: (id) => ({
        url: `entity/${id}`,
        providesTags: (result, error, id) => [{ type: "Entity", id }],
      }),

      // onQuery started:
      // Dispatches the other queries
      // Note: ".unwrap" - this will return a new promise which contains the *actual* action to be executed.

      async onQueryStarted(id, { dispatch }) {
        try {
          // get connected inbox items associated with this item Id
          const inboxItems = await dispatch(api.endpoints.getConnectedInboxItems.initiate(id))
            .unwrap()
            .catch(() => null);
          // get connected documents/objects associated with this item Id
          const connectedDocs = await dispatch(api.endpoints.getEntityConnectedDocs.initiate(id))
            .unwrap()
            .catch(() => null);
          // get connected queriess associated with this item Id
          const connectedQueries = await dispatch(
            api.endpoints.getEntityConnectedQueries.initiate(id),
          )
            .unwrap()
            .catch(() => null);
          // get connected comments associated with this item Id
          const connectedComments = await dispatch(
            api.endpoints.getEntityConnectedComments.initiate(id),
          )
            .unwrap()
            .catch(() => null);

          /* 
            upDateQueryData will then take the result of the initial query and appends the result of the actual actions.
            Result (in case of Entities ) - an object 'fetchedEntity' is then returned with the additional keys which can be accessed in 
            the component like: fetchedEntity.connectedDocs, fetchedEntity.connectedQueries
            Essentially, this removes the need for repeated calls to be made from the Frontend to hydrate associated objects. 
          */

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

    /* 
      Get Study By Id: gets a specific entity by Id and chain subsequent queries, appending to the main query. 

      What is happening here ?
      Entities are hydrated by a range of builder queries, which are each dispatched with a common parameter - the study id. 
      On the Study.tsx component, as single call is made to the getStudyId query, 
    
      Here, we're using OnQueryStarted to dispatch the subsequent queries, which hiterto returned an object via a separate cal.     
    */

    getStudyById: builder.query<Study, void>({
      query: (id) => ({
        url: `study/${id}`,
        providesTags: (result, error, id) => [{ type: "Study", id }],
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          // Attempt to fetch the main document
          const { data: study } = await queryFulfilled;
          if (!study) throw new Error("Study data not found");

          try {
            // Fetch additional related data with Promise.all
            const [inboxItems, connectedStudies, connectedDocs, connectedComments, maturityRadar] =
              await Promise.all([
                dispatch(api.endpoints.getConnectedInboxItems.initiate(id))
                  .unwrap()
                  .catch(() => null),
                dispatch(api.endpoints.getStudyConnectedQueries.initiate(id))
                  .unwrap()
                  .catch(() => null),
                dispatch(api.endpoints.getStudyConnectedDocs.initiate(id))
                  .unwrap()
                  .catch(() => null),
                dispatch(api.endpoints.getStudyConnectedComments.initiate(id))
                  .unwrap()
                  .catch(() => null),
                dispatch(api.endpoints.getStudyMaturityRadar.initiate(id))
                  .unwrap()
                  .catch(() => null),
              ]);

            // Merge all the data into the study object
            dispatch(
              api.util.updateQueryData("getStudyById", id, (draft) => {
                draft.connectedInboxItems = inboxItems ?? [];
                draft.connectedStudies = connectedStudies ?? [];
                draft.connectedDocs = connectedDocs ?? [];
                draft.connectedComments = connectedComments ?? [];
                draft.maturityRadar = maturityRadar ?? null; // Merging Maturity Radar here
              }),
            );
          } catch (relatedDataError) {
            console.error("Error fetching related study data:", relatedDataError);
          }
        } catch {
          // silent fail
        }
      },
    }),

    getStudyMaturityRadar: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/maturity-radar/4/${id}`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    createMaturityRadar: builder.mutation({
      queryFn: (id) => {
        return {
          data: {
            id,
            status: "success",
            message: "Dummy response for createMaturityRadar",
            createdAt: new Date().toISOString(),
          },
        };
      },
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    // Connected Study Queries (linked to id)
    getStudyConnectedQueries: builder.query<Study[], void>({
      query: (id) => ({
        url: `study/${id}/queries`,
      }),
    }),

    getStudyConnectedDocs: builder.query<Entity[], void>({
      query: (id) => ({
        url: `study/${id}/saveddocuments?orderBy=2&doIncludePatents=true&doIncludeScienceArticles=true&doIncludeWeblinks=true`,
      }),
    }),

    // Connected Comments (linked to id)
    getStudyConnectedComments: builder.query<Entity[], void>({
      query: (id) => ({
        url: `v2/comment/4/${id}`,
      }),
    }),
  }),
});

export const usePrefetchedData = (id: string, type: number) => {
  return useGetConnectedObjectsQuery(
    { id, type },
    { skip: !id }, // Prevents fetching if `id` is missing
  );
};

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
  useGetStudyConnectedQueriesQuery,
  useGetStudyConnectedDocsQuery,
  useGetStudyConnectedCommentsQuery,
  useGetStudyMaturityRadarQuery,
  usePrefetch,
} = documentApi;
