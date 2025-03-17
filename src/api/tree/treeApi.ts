import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const treeApi = createApi({
  reducerPath: "treeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }), // Update as needed
  endpoints: (builder) => ({
    fetchTreeData: builder.query({
      query: () => "treeData", // Endpoint to fetch tree data
    }),
  }),
});

export const { useFetchTreeDataQuery } = treeApi;
