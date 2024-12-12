import { api } from '../api';
import { Entity, SavedDocumentResponse } from '../../types/types'; // Adjust the import path as needed

export const entityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createEntity: builder.mutation<Entity, Partial<Entity>>({
      query: (entity) => ({
        url: '',
        method: 'POST',
        body: entity,
      }),
    }),
    getEntities: builder.query<Entity[], void>({
        query: () => ({
            url: 'entity',
            params: {
              orderBy: 2,
              createdByMe:false
            }
        })
    }),

    getEntityById: builder.query<SavedDocumentResponse, void>({
      query: (id) => ({
        url: `entity/${id}`,
      }),
    }),

    updateEntityTitle: builder.mutation<Entity, { id: number; title: string }>({
      query: ({ id, title }) => ({
        url: `/${id}/title`,
        method: 'PUT',
        body: { title },
      }),
    }),
    
    deleteEntity: builder.mutation<{ success: boolean; id: string }, number>({
      query: (id) => ({
          url: `/${id}`,
          method: 'DELETE',
      }),
  }),
  }),
});

export const { 
  useCreateEntityMutation,
  useGetEntitiesQuery,
  useGetEntityByIdQuery,
  useUpdateEntityTitleMutation,
  useDeleteEntityMutation,
} = entityApi;
