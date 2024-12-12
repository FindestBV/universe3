import { api } from '../api'; // Import the centralized base API
import type { User, LoginRequest, AuthResponse } from "../../types/types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: 'authentication/verify',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    getProfile: builder.query<User, void>({
      query: () => 'authentication/profile',
      providesTags: ['Auth'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'authentication/logout',
        method: 'GET',
      }),
      invalidatesTags: ['Auth'],
    }),

    checkIsObjectSharedToUser: builder.query<void, { email: string; objectId: string }>({
      query: ({ email, objectId }) => ({
        url: `object/shared/${objectId}`,
        method: 'POST',
        body: { email },
      }),
    }),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    verifyAuth: builder.mutation<AuthResponse, { sharedToSettings: any }>({
      query: (body) => ({
        url: 'authentication/verify',
        method: 'POST',
        body,
      }),
    }),
  }),
});

// Export RTK Query hooks for use in components
export const {
  useLoginMutation,
  useGetProfileQuery,
  useLogoutMutation,
  useCheckIsObjectSharedToUserQuery,
  useVerifyAuthMutation,
} = authApi;
