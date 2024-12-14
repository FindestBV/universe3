import { api } from '../api';
import type { SavedDocumentResponse } from '@/types/types';

export const searchApi = api.injectEndpoints({
  endpoints: (builder) => ({
    searchItems: builder.mutation<SavedDocumentResponse, string>({
      query: (query) => `search/searchbar?query=${query}&api-version=2.0`
    }),
  }),
});

export const { useSearchItemsMutation, usePrefetch } = searchApi;
