import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DocumentState {
  isEditing: boolean;
  isLocked: boolean;
  documentId: string | null;
  isDialogOpen: boolean;
  isMinimized: boolean;
  dialogDocumentId: string | null;
  elapsedTime: number;
  queryTime: number;
  articles: string[]; // Mock fetched data
  loading: boolean;
}

const initialState: DocumentState = {
  isEditing: false,
  isLocked: false,
  documentId: null,
  isDialogOpen: false,
  isMinimized: false,
  dialogDocumentId: null,
  elapsedTime: 0,
  queryTime: 0,
  articles: [],
  loading: false,
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setEditingState: (
      state,
      action: PayloadAction<{ isEditing: boolean; documentId: string | null }>,
    ) => {
      state.isEditing = action.payload.isEditing;
      state.documentId = action.payload.documentId;
    },
    resetEditingState(state) {
      state.isEditing = false;
      state.documentId = null;
    },
    setLockPage: (
      state,
      action: PayloadAction<{ isLocked: boolean; documentId: string | null }>,
    ) => {
      state.isLocked = action.payload.isLocked;
      state.documentId = action.payload.documentId;
    },
    openDialog: (state, action: PayloadAction<{ documentId: string }>) => {
      state.isDialogOpen = true;
      state.dialogDocumentId = action.payload.documentId;
      state.isMinimized = false;
    },
    closeDialog: (state) => {
      state.isDialogOpen = false;
      state.dialogDocumentId = null;
      state.isMinimized = false;
    },
    minimizeDialog: (state) => {
      state.isMinimized = true;
    },
    restoreDialog: (state) => {
      state.isMinimized = false;
    },
    clearDialogState: (state) => {
      state.isDialogOpen = false;
      state.isMinimized = false;
      state.dialogDocumentId = null;
      state.elapsedTime = 0;
      state.articles = [];
    },
    startTimer: (state) => {
      if (state.elapsedTime === 0) {
        state.elapsedTime = 1;
      }
    },
    updateTimer: (state) => {
      state.elapsedTime += 1;
    },
    resetTimer: (state) => {
      state.elapsedTime = 0;
    },
    fetchArticlesStart: (state) => {
      state.loading = true;
    },
    fetchArticlesSuccess: (state, action: PayloadAction<string[]>) => {
      state.articles = action.payload;
      state.loading = false;
      state.queryTime = state.elapsedTime; // Store elapsed time as queryTime
      state.elapsedTime = 0; // Reset elapsed time AFTER storing it
    },
  },
});

export const {
  setEditingState,
  resetEditingState,
  setLockPage,
  openDialog,
  closeDialog,
  minimizeDialog,
  restoreDialog,
  clearDialogState,
  startTimer,
  updateTimer,
  resetTimer,
  fetchArticlesStart,
  fetchArticlesSuccess,
} = documentSlice.actions;

export default documentSlice.reducer;
