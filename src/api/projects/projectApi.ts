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
      providesTags: ["Project"],
    }),

    // Single project's pages
    getProjectPages: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}/pages`,
      providesTags: (result, error, id) => [{ type: "ProjectPages", id }],
    }),

    // Single project's saved sources
    getProjectSavedSources: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}/saved-sources`,
      providesTags: (result, error, id) => [{ type: "ProjectSavedSources", id }],
    }),

    // Single project's overview
    getProjectOverview: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}/overview`,
      providesTags: (result, error, id) => [{ type: "ProjectOverview", id }],
    }),

    // Single project's structure
    getProjectStructure: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}/structure`,
      providesTags: (result, error, id) => [{ type: "ProjectStructure", id }],
    }),

    // Single project's tabs
    getProjectTabs: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}/tabs`,
      providesTags: (result, error, id) => [{ type: "ProjectTabs", id }],
    }),

    // Get specific tab inside a project
    getProjectTabById: builder.query<SavedDocumentResponse, { projectId: string; tabId: string }>({
      query: ({ projectId, tabId }) => `/v1/projects/${projectId}/tabs/${tabId}`,
      providesTags: (result, error, { tabId }) => [{ type: "ProjectTab", id: tabId }],
    }),

    // Single project's statistics
    getProjectStatistics: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}/statistics`,
      providesTags: (result, error, id) => [{ type: "ProjectStatistics", id }],
    }),

    // Single project's notifications
    getProjectNotifications: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}/notifications`,
      providesTags: (result, error, id) => [{ type: "ProjectNotifications", id }],
    }),

    // Update tab order in a project
    updateProjectTabOrder: builder.mutation<void, { projectId: string; newOrder: number[] }>({
      query: ({ projectId, newOrder }) => ({
        url: `/v1/projects/${projectId}/tabs/order`,
        method: "PUT",
        body: { newOrder },
      }),
      invalidatesTags: [{ type: "ProjectTabs" }],
    }),

    // Fetch a single project by ID
    getProjectById: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}`,
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),

    // Project's maturity radar data
    getProjectMaturityRadar: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}/maturity-radar`,
      providesTags: (result, error, id) => [{ type: "MaturityRadar", id }],
    }),

    // Results overview table
    getResultsOverviewTable: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/results-overview-tables/${id}`,
      providesTags: (result, error, id) => [{ type: "ResultsOverviewTable", id }],
    }),

    // Add Maturity Radar data to pages
    addMaturityRadarToPages: builder.mutation<void, { projectId: string; pageId: string }>({
      query: ({ projectId, pageId }) => ({
        url: `/v1/maturity-radar/${projectId}/pages/${pageId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "MaturityRadar" }],
    }),

    // Remove page from a project
    deleteProjectPage: builder.mutation<void, { projectId: string; pageId: string }>({
      query: ({ projectId, pageId }) => ({
        url: `/v1/projects/${projectId}/pages/${pageId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ProjectPages" }],
    }),

    // Fetch maturity radar by ID
    getMaturityRadar: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/maturity-radar/4/${id}`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
      overrideExisting: true,
    }),

    // Create a Maturity Radar entry
    createMaturityRadar: builder.mutation<SavedDocumentResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/v1/maturity-radar`,
        method: "POST",
        body: { id },
      }),
      invalidatesTags: [{ type: "SavedDocument" }],
      overrideExisting: true,
    }),
  }),
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
