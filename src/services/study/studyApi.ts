import { api } from '../api';
import { Study } from '../../types/types'; // Adjust the import path as needed


export const studyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createStudy: builder.mutation<Study, Partial<Study>>({
      query: (study) => ({
        url: '',
        method: 'POST',
        body: study,
      }),
    }),

    getStudies: builder.query<{ studies: Study[]; totalItems: number; totalPages: number; page: number }, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: 'study',
        params: {
          orderBy: 2,
          createdByMe: false,
          page,
          limit,
        },
      }),
    }),
    getStudyById: builder.query<Study, number>({
      query: (id) => `/${id}`,
    }),

    updateStudyTitle: builder.mutation<Study, { id: number; title: string }>({
      query: ({ id, title }) => ({
        url: `/${id}/title`,
        method: 'PUT',
        body: { title },
      }),
    }),
    deleteStudy: builder.mutation<{ success: boolean; id: string }, number>({
      query: (id) => ({
          url: `/${id}`,
          method: 'DELETE',
      }),
  }),
  }),
});

export const { 
  useCreateStudyMutation,
  useGetStudiesQuery,
  useGetStudyByIdQuery,
  useUpdateStudyTitleMutation,
  useDeleteStudyMutation,
} = studyApi;
