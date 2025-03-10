// Prepare for ProjectsAPI
// src/features/projectsApi.ts
import type { SavedDocumentResponse } from "@/types/types";

import { api } from "../api";

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all projects
    getProjects: builder.query<SavedDocumentResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: "/v1/projects",
        params: { page, limit },
      }),
      providesTags: ["SavedDocument"],
    }),

    // Single project's pages
    getProjectPages: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}/pages`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    // Single project's saved sources
    getProjectSavedSources: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}/saved-sources`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    // Single project's overview
    getProjectOverview: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}/overview`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    // Single project's structure
    getProjectStructure: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}/structure`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    // Single project's tabs
    getProjectTabs: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}/tabs`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    // Get specific tab inside a project
    getProjectTabById: builder.query<SavedDocumentResponse, { projectId: string; tabId: string }>({
      query: ({ projectId, tabId }) => `/v1/projects/${projectId}/tabs/${tabId}`,
      providesTags: (result, error, { tabId }) => [{ type: "SavedDocument", id: tabId }],
    }),

    // Single project's statistics
    getProjectStatistics: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}/statistics`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    // Single project's notifications
    getProjectNotifications: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}/notifications`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    // Update tab order in a project
    updateProjectTabOrder: builder.mutation<void, { projectId: string; newOrder: number[] }>({
      query: ({ projectId, newOrder }) => ({
        url: `/v1/projects/${projectId}/tabs/order`,
        method: "PUT",
        body: { newOrder },
      }),
      invalidatesTags: [{ type: "SavedDocument" }],
    }),

    // Fetch a single project by ID
    getProjectById: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    // Project's maturity radar data
    getProjectMaturityRadar: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}/maturity-radar`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
      // Add async updates support
      async onCacheEntryAdded(id, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        // Create a WebSocket connection when the cache entry is added
        const ws = new WebSocket(
          `${import.meta.env.VITE_REACT_APP_WS_BASE_URL}/maturity-radar/${id}`,
        );

        try {
          // Wait for the initial query to resolve before proceeding
          await cacheDataLoaded;

          // Set up event listener for the WebSocket
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);

            // Update the cached data when we receive a message
            updateCachedData((draft) => {
              // Assuming the data structure matches what we need
              // Modify the draft based on the received data
              Object.assign(draft, data);
            });
          };

          ws.addEventListener("message", listener);
        } catch {
          // No-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }

        // When the cache entry is removed, clean up the WebSocket
        await cacheEntryRemoved;
        ws.close();
      },
    }),

    // Results overview table
    getResultsOverviewTable: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/results-overview-tables/${id}`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    // Add Maturity Radar data to pages
    addMaturityRadarToPages: builder.mutation<void, { projectId: string; pageId: string }>({
      query: ({ projectId, pageId }) => ({
        url: `/v1/maturity-radar/${projectId}/pages/${pageId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "SavedDocument" }],
    }),

    // Remove page from a project
    deleteProjectPage: builder.mutation<void, { projectId: string; pageId: string }>({
      query: ({ projectId, pageId }) => ({
        url: `/v1/projects/${projectId}/pages/${pageId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "SavedDocument" }],
    }),

    // Fetch maturity radar by ID
    getMaturityRadar: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/maturity-radar/4/${id}`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    // Create a Maturity Radar entry
    createMaturityRadar: builder.mutation<SavedDocumentResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/v1/maturity-radar`,
        method: "POST",
        body: { id },
      }),
      invalidatesTags: [{ type: "SavedDocument" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProjectsQuery,
  useGetProjectPagesQuery,
  useGetProjectSavedSourcesQuery,
  useGetProjectOverviewQuery,
  useGetProjectStructureQuery,
  useGetProjectTabsQuery,
  useGetProjectTabByIdQuery,
  useGetProjectStatisticsQuery,
  useGetProjectNotificationsQuery,
  useUpdateProjectTabOrderMutation,
  useGetProjectByIdQuery,
  useGetProjectMaturityRadarQuery,
  useGetResultsOverviewTableQuery,
  useGetMaturityRadarQuery,
  useCreateMaturityRadarMutation,
  useAddMaturityRadarToPagesMutation,
  useDeleteProjectPageMutation,
} = projectApi;
