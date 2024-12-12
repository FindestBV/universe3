import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { studyApi } from './study'; // Assuming you have your API slice in a separate file
import { Study, StudyState } from '@/types/types';

const initialState: StudyState = {
    studies: [],
    selectedStudy: null,
    isLoading: false,
    error: null,
    filters: {
      id: '',
      title: '',
      type: '',
    },
    pagination: {
      page: 1,
      totalPages: 1,
      totalItems: 0,
    },
  };
  
  const studySlice = createSlice({
    name: 'study',
    initialState,
    reducers: {
      setStudies: (state, action: PayloadAction<{ studies: Study[]; pagination: StudyState['pagination'] }>) => {
        state.studies = action.payload.studies;
        state.pagination = action.payload.pagination;
        state.error = null;
      },
      setSelectedStudy: (state, action: PayloadAction<Study | null>) => {
        state.selectedStudy = action.payload;
      },
      setFilters: (state, action: PayloadAction<StudyState['filters']>) => {
        state.filters = {
          ...state.filters,
          ...action.payload,
        };
      },
      clearFilters: (state) => {
        state.filters = initialState.filters;
      },
      setLoading: (state, action: PayloadAction<boolean>) => {
        state.isLoading = action.payload;
      },
      setError: (state, action: PayloadAction<string | null>) => {
        state.error = action.payload;
      },
      clearStudies: (state) => {
        state.studies = [];
        state.selectedStudy = null;
        state.filters = initialState.filters;
        state.error = null;
        state.pagination = initialState.pagination;
      },
      setPage: (state, action: PayloadAction<number>) => {
        state.pagination.page = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addMatcher(
          studyApi.endpoints.getStudies.matchFulfilled,
          (state, action) => {
            state.isLoading = false;
            state.studies = action.payload.studies;
            state.pagination = {
              page: action.payload.page,
              totalPages: action.payload.totalPages,
              totalItems: action.payload.totalItems,
            };
            state.error = null;
          }
        )
        .addMatcher(
          studyApi.endpoints.getStudies.matchPending,
          (state) => {
            state.isLoading = true;
          }
        )
        .addMatcher(
          studyApi.endpoints.getStudies.matchRejected,
          (state, action) => {
            state.isLoading = false;
            state.error = action.error.message ?? 'Failed to fetch studies';
          }
        );
    },
  });
  
  export const {
    setStudies,
    setSelectedStudy,
    setFilters,
    clearFilters,
    setLoading,
    setError,
    clearStudies,
    setPage,
  } = studySlice.actions;
  
  export const selectAllStudies = (state: { study: StudyState }) => state.study.studies;
  export const selectPagination = (state: { study: StudyState }) => state.study.pagination;
  export const selectStudyLoading = (state: { study: StudyState }) => state.study.isLoading;
  export const selectStudyError = (state: { study: StudyState }) => state.study.error;
  
  export default studySlice.reducer;
  