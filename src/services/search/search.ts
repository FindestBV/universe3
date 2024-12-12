import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SavedDocumentResponse } from '@/types/types';

const rootUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL; 
const token = import.meta.env.VITE_ACCESS_TOKEN;


export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: rootUrl,
    prepareHeaders: (headers) => {
      headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    searchItems: builder.mutation<SavedDocumentResponse, string>({
      query: (query) => `search/searchbar?query=${query}&api-version=2.0`
    }),
  }),
});

export const { useSearchItemsMutation } = searchApi;
