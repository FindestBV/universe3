// src/features/projectsApi.ts
import type { SavedDocumentResponse } from "@/types/types";

import { api } from "../api";

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useGetMaturityRadarQuery, useCreateMaturityRadarMutation } = projectApi;
