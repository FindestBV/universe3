// src/features/projectsApi.ts
import type {
  Project,
  ProjectPage,
  ProjectSource,
  ProjectTab,
  SavedDocumentResponse,
} from "@/types/types";

import { api } from "../api";

export interface ProjectsResponse {
  data: Project[];
  total: number;
  page: number;
  limit: number;
}

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Project List Operations
    getProjects: builder.query<ProjectsResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: "/api/v1/projects",
        params: { page, limit },
      }),
      providesTags: ["SavedDocument"],
    }),

    // Single Project Operations
    getProjectById: builder.query<Project, string>({
      query: (id) => `/api/v1/projects/${id}`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/v1/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SavedDocument"],
    }),

    updateProject: builder.mutation<Project, { id: string; data: Partial<Project> }>({
      query: ({ id, data }) => ({
        url: `/api/v1/projects/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "SavedDocument", id }],
    }),

    createProject: builder.mutation<Project, Partial<Project>>({
      query: (data) => ({
        url: `/api/v1/projects`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SavedDocument"],
    }),

    // Saved Sources Operations
    addSavedSource: builder.mutation<
      void,
      { projectId: string; sourceData: Partial<ProjectSource> }
    >({
      query: ({ projectId, sourceData }) => ({
        url: `/api/v1/projects/${projectId}/saved-sources`,
        method: "POST",
        body: sourceData,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    removeSavedSource: builder.mutation<void, { projectId: string; sourceId: string }>({
      query: ({ projectId, sourceId }) => ({
        url: `/api/v1/projects/${projectId}/saved-sources/${sourceId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    bulkAddSavedSources: builder.mutation<
      void,
      { projectId: string; sources: Partial<ProjectSource>[] }
    >({
      query: ({ projectId, sources }) => ({
        url: `/api/v1/projects/${projectId}/saved-sources/bulk`,
        method: "POST",
        body: { sources },
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Pages Operations
    addPage: builder.mutation<void, { projectId: string; pageData: Partial<ProjectPage> }>({
      query: ({ projectId, pageData }) => ({
        url: `/api/v1/projects/${projectId}/pages`,
        method: "POST",
        body: pageData,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    removePage: builder.mutation<void, { projectId: string; pageId: string }>({
      query: ({ projectId, pageId }) => ({
        url: `/api/v1/projects/${projectId}/pages/${pageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    bulkAddPages: builder.mutation<void, { projectId: string; pages: Partial<ProjectPage>[] }>({
      query: ({ projectId, pages }) => ({
        url: `/api/v1/projects/${projectId}/pages/bulk`,
        method: "POST",
        body: { pages },
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Tabs Operations
    createProjectTab: builder.mutation<void, { projectId: string; tabData: Partial<ProjectTab> }>({
      query: ({ projectId, tabData }) => ({
        url: `/api/v1/projects/${projectId}/tabs`,
        method: "POST",
        body: tabData,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    updateProjectTab: builder.mutation<
      void,
      { projectId: string; tabId: string; tabData: Partial<ProjectTab> }
    >({
      query: ({ projectId, tabId, tabData }) => ({
        url: `/api/v1/projects/${projectId}/tabs/${tabId}`,
        method: "PATCH",
        body: tabData,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    updateProjectTabOrder: builder.mutation<void, { projectId: string; newOrder: number[] }>({
      query: ({ projectId, newOrder }) => ({
        url: `/api/v1/projects/${projectId}/tabs/update-order`,
        method: "PATCH",
        body: { newOrder },
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "SavedDocument", id: projectId }],
    }),

    // Maturity Radar Operations (preserved from original)
    getProjectMaturityRadar: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/v1/projects/${id}/maturity-radar`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    getMaturityRadar: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/maturity-radar/4/${id}`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
    }),

    createMaturityRadar: builder.mutation<SavedDocumentResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/v1/maturity-radar`,
        method: "POST",
        body: { id },
      }),
      invalidatesTags: [{ type: "SavedDocument" }],
    }),

    addMaturityRadarToPages: builder.mutation<void, { projectId: string; pageId: string }>({
      query: ({ projectId, pageId }) => ({
        url: `/v1/maturity-radar/${projectId}/pages/${pageId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "SavedDocument" }],
    }),
  }),
});

export const {
  // Project Operations
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
  useCreateProjectMutation,

  // Saved Sources Operations
  useAddSavedSourceMutation,
  useRemoveSavedSourceMutation,
  useBulkAddSavedSourcesMutation,

  // Pages Operations
  useAddPageMutation,
  useRemovePageMutation,
  useBulkAddPagesMutation,

  // Tabs Operations
  useCreateProjectTabMutation,
  useUpdateProjectTabMutation,
  useUpdateProjectTabOrderMutation,

  // Maturity Radar Operations
  useGetProjectMaturityRadarQuery,
  useGetMaturityRadarQuery,
  useCreateMaturityRadarMutation,
  useAddMaturityRadarToPagesMutation,
} = projectApi;
