import { api } from '../api'; // Import the centralized base API
import type { SavedDocumentResponse } from '@/types/types';

export const activityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyRecentActivity: builder.query<SavedDocumentResponse, void>({
      query: () => ({
        url: 'mysimplerecent',
        // url: 'my/',
        params: {
          orderBy: 2,
          createdByMe:true
        }
      }),
      providesTags: ['SavedDocument'],
    }),
  }),  
});

export const { useGetMyRecentActivityQuery } = activityApi;