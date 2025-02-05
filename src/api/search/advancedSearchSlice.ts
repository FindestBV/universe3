import { saveSearch } from "@/lib/db";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  activeSearches: SearchQuery[];
  completedSearches: SearchQuery[];
}

export interface SearchQuery {
  id?: number;
  step1Data: {
    searchTerm: string;
    category: string;
  };
  step2Data: {
    filters: string[];
    sortBy: string;
  };
  status: "pending" | "completed" | "error";
  results?: any;
  timestamp: number;
}

const initialState: SearchState = {
  activeSearches: [],
  completedSearches: [],
};

export const advancedSearchSlice = createSlice({
  name: "advancedSearch",
  initialState,
  reducers: {
    addSearch: (state, action: PayloadAction<SearchQuery>) => {
      state.activeSearches.push(action.payload);
      // Save to IndexedDB
      saveSearch(action.payload);
    },
    updateSearchStatus: (
      state,
      action: PayloadAction<{
        id: number;
        status: "pending" | "completed" | "error";
        results?: any;
      }>,
    ) => {
      const search = state.activeSearches.find((s) => s.id === action.payload.id);
      if (search) {
        search.status = action.payload.status;
        if (action.payload.results) {
          search.results = action.payload.results;
        }
        if (action.payload.status === "completed") {
          state.completedSearches.push(search);
          state.activeSearches = state.activeSearches.filter((s) => s.id !== action.payload.id);
        }
      }
    },
  },
});

export const { addSearch, updateSearchStatus } = advancedSearchSlice.actions;
export default advancedSearchSlice.reducer;
