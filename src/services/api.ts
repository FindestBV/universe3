import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API config
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_REACT_APP_API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = import.meta.env.VITE_ACCESS_TOKEN;
    headers.set('authorization', `Bearer ${token}`);
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['SavedDocument', 'SearchResults', 'Auth', 'Entity'], // Add shared tag types
  endpoints: () => ({}), // Empty endpoints to extend
});
