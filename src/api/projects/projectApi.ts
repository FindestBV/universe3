// Prepare for ProjectsAPI
// src/features/projectsApi.ts
import type {
  AddSavedSourceRequest,
  BaseListResponse,
  CreateProjectRequest,
  Page,
  PageListItem,
  Project,
  ProjectListResponse,
  ProjectOverview,
  SavedDocumentResponse,
  UpdateProjectRequest,
} from "@/types/types";

import { api } from "../api";

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get project overview
    getProjectOverview: builder.query<ProjectOverview, string>({
      query: (id) => `/v1/projects/${id}/overview`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    // List all projects
    getProjects: builder.query<ProjectListResponse, { skip?: number; limit?: number }>({
      query: ({ skip = 0, limit = 10 }) => ({
        url: "/v1/projects",
        params: { skip, limit },
      }),
      providesTags: ["SavedDocument"],
    }),

    // Create project
    createProject: builder.mutation<Project, CreateProjectRequest>({
      query: (body) => ({
        url: "/v1/projects",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["SavedDocument"],
    }),

    // Delete project
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/v1/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SavedDocument"],
    }),

    // Update project
    updateProject: builder.mutation<Project, { id: string; body: UpdateProjectRequest }>({
      query: ({ id, body }) => ({
        url: `/v1/projects/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "SavedDocument", id }],
    }),

    // Add saved source to project
    addSavedSource: builder.mutation<void, { projectId: string; body: AddSavedSourceRequest }>({
      query: ({ projectId, body }) => ({
        url: `/v1/projects/${projectId}/saved-sources`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Remove saved sources from project
    removeSavedSources: builder.mutation<void, string>({
      query: (projectId) => ({
        url: `/v1/projects/${projectId}/saved-sources`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, projectId) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Get saved sources of project
    getProjectSavedSources: builder.query<
      SavedDocumentResponse,
      { projectId: string; skip?: number; limit?: number }
    >({
      query: ({ projectId, skip = 0, limit = 10 }) => ({
        url: `/v1/projects/${projectId}/saved-sources`,
        params: { skip, limit },
      }),
      providesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Add saved sources to project in bulk
    addSavedSourcesBulk: builder.mutation<
      void,
      { projectId: string; body: AddSavedSourceRequest[] }
    >({
      query: ({ projectId, body }) => ({
        url: `/v1/projects/${projectId}/saved-sources/bulk`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Remove saved source from project
    removeSavedSource: builder.mutation<void, { projectId: string; sourceId: string }>({
      query: ({ projectId, sourceId }) => ({
        url: `/v1/projects/${projectId}/saved-sources/${sourceId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Add page to project
    addPage: builder.mutation<void, { projectId: string; body: any }>({
      query: ({ projectId, body }) => ({
        url: `/v1/projects/${projectId}/pages`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Remove pages from project
    removePages: builder.mutation<void, string>({
      query: (projectId) => ({
        url: `/v1/projects/${projectId}/pages`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, projectId) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Get pages of project
    getProjectPages: builder.query<
      BaseListResponse<PageListItem>,
      { projectId: string; skip?: number; limit?: number }
    >({
      query: ({ projectId, skip = 0, limit = 10 }) => ({
        url: `/v1/projects/${projectId}/pages`,
        params: { skip, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "SavedDocument" as const, id })),
              { type: "SavedDocument", id: "LIST" },
            ]
          : [{ type: "SavedDocument", id: "LIST" }],
    }),

    // Add pages to project in bulk
    addPagesBulk: builder.mutation<void, { projectId: string; body: any[] }>({
      query: ({ projectId, body }) => ({
        url: `/v1/projects/${projectId}/pages/bulk`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Remove page from project
    removePage: builder.mutation<void, { projectId: string; pageId: string }>({
      query: ({ projectId, pageId }) => ({
        url: `/v1/projects/${projectId}/pages/${pageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Create tab
    createTab: builder.mutation<void, { projectId: string; body: any }>({
      query: ({ projectId, body }) => ({
        url: `/v1/projects/${projectId}/tabs`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Update tab
    updateTab: builder.mutation<void, { projectId: string; tabId: string; body: any }>({
      query: ({ projectId, tabId, body }) => ({
        url: `/v1/projects/${projectId}/tabs/${tabId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Update order of tabs
    updateTabOrder: builder.mutation<void, { projectId: string; body: any }>({
      query: ({ projectId, body }) => ({
        url: `/v1/projects/${projectId}/tabs/update-order`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Follow project
    followProject: builder.mutation<void, string>({
      query: (projectId) => ({
        url: `/v1/projects/${projectId}/follow`,
        method: "POST",
      }),
      invalidatesTags: (result, error, projectId) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Unfollow project
    unfollowProject: builder.mutation<void, string>({
      query: (projectId) => ({
        url: `/v1/projects/${projectId}/follow`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, projectId) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Change ownership of project
    changeProjectOwnership: builder.mutation<void, { projectId: string; body: any }>({
      query: ({ projectId, body }) => ({
        url: `/v1/projects/${projectId}/change-ownership`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Get maturity radar for a project
    getMaturityRadar: builder.query<SavedDocumentResponse, string>({
      query: (projectId) => ({
        url: `/v1/projects/${projectId}/maturity-radar`,
        method: "GET",
      }),
      transformResponse: (response) => {
        // Mock response structure that matches SavedDocumentResponse
        return {
          documents: [
            {
              id: "mock-radar-id",
              title: "Project Maturity Radar",
              linkedCounts: {
                comments: 0,
                documents: 0,
                queries: 0,
                inboxItems: 0,
              },
              url: `/projects/maturity-radar/mock-radar-id`,
              type: "maturity-radar",
              dateAdded: new Date().toISOString(),
              maturityRadarData: {
                categories: [
                  { name: "Technology", score: 0.8 },
                  { name: "Market", score: 0.6 },
                  { name: "Business", score: 0.7 },
                  { name: "Organization", score: 0.5 },
                ],
                overallScore: 0.65,
                lastUpdated: new Date().toISOString(),
              },
            },
          ],
          total: 1,
          severity: 0,
        };
      },
      providesTags: (result, error, projectId) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Create maturity radar for a project
    createMaturityRadar: builder.mutation<SavedDocumentResponse, string>({
      query: (projectId) => ({
        url: `/v1/projects/${projectId}/maturity-radar`,
        method: "POST",
      }),
      transformResponse: (response, meta, projectId) => {
        // Mock response structure that matches SavedDocumentResponse
        return {
          documents: [
            {
              id: "new-radar-" + projectId,
              title: "New Project Maturity Radar",
              linkedCounts: {
                comments: 0,
                documents: 0,
                queries: 0,
                inboxItems: 0,
              },
              url: `/projects/maturity-radar/new-radar-${projectId}`,
              type: "maturity-radar",
              dateAdded: new Date().toISOString(),
              maturityRadarData: {
                categories: [
                  { name: "Technology", score: 0.3 },
                  { name: "Market", score: 0.2 },
                  { name: "Business", score: 0.4 },
                  { name: "Organization", score: 0.1 },
                ],
                overallScore: 0.25,
                lastUpdated: new Date().toISOString(),
              },
            },
          ],
          total: 1,
          severity: 0,
        };
      },
      invalidatesTags: (result, error, projectId) => [{ type: "SavedDocument", id: projectId }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProjectOverviewQuery,
  useGetProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
  useAddSavedSourceMutation,
  useRemoveSavedSourcesMutation,
  useGetProjectSavedSourcesQuery,
  useAddSavedSourcesBulkMutation,
  useRemoveSavedSourceMutation,
  useAddPageMutation,
  useRemovePagesMutation,
  useGetProjectPagesQuery,
  useAddPagesBulkMutation,
  useRemovePageMutation,
  useCreateTabMutation,
  useUpdateTabMutation,
  useUpdateTabOrderMutation,
  useFollowProjectMutation,
  useUnfollowProjectMutation,
  useChangeProjectOwnershipMutation,
  useGetMaturityRadarQuery,
  useCreateMaturityRadarMutation,
} = projectApi;
