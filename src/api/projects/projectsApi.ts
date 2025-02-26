// src/features/projectsApi.ts
import type { SavedDocumentResponse } from "@/types/types";

import { api } from "../api";

// QUERIES
// /api/v1/projects/{id}/pages    ### Single Project By Id / Pages
// /api/v1/projects/{id}/saved-sources    ### Single Project By Id / saved-sources (ex: inbox/documents?)
// /api/v1/projects/{id}/overview ### Single Project By Id / overview
// /api/v1/projects/{id}/structure ### Single Project By Id / structure (needs to render one level higher than the page/subs)
// /api/v1/projects/{id}/tabs/{id}  ### Single Project By Id / Tabs / TabID - list the tabs
// /api/v1/projects/{id}/statistics ### Single Project By Id / Stats
// /api/v1/projects/{id}/notifications  ### Single Project By Id / notifications

// MUTATIONS
// PUT /api/projects/{projectId}/tabs/order  ## Assign Tab Order

// MatRad:
// /api/v1/projects               ### All
// /api/v1/projects/{id}          ### Single Project By Id
// /api/v1/projects/{id}/tabs     ### Single Project By Id -> Tabs
// /api/v1/results-overview-tables/{id}
// /api/v1/maturity-radar/{id}/api/v1/projects/{id}/pages -> add to pages
// /api/v1/projects/{projectId}/pages/{pageId} -> http delete, remove page

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<SavedDocumentResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: "/v1/projects",
        params: {
          page,
          limit,
        },
      }),
      // providesTags: ["Project"],
    }),

    getSavedMaturityRadars: builder.query<SavedDocumentResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: "/maturity-radar/4/08dd1e7c-8f94-478d-89ea-7d6cfae32a8e",
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

    getMaturityRadar: builder.query<SavedDocumentResponse, string>({
      query: (id) => `/maturity-radar/4/${id}`,
      providesTags: (result, error, id) => [{ type: "SavedDocument", id }],
      overrideExisting: true,
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
      overrideExisting: true,
    }),
  }),
});

export const { useGetProjectsQuery, useGetMaturityRadarQuery, useCreateMaturityRadarMutation } =
  projectApi;
