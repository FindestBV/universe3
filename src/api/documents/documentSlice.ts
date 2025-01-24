import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DocumentState {
  isEditing: boolean;
  isLocked: boolean;
  documentId: string | null;
}

const initialState: DocumentState = {
  isEditing: false,
  isLocked: false,
  documentId: null,
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
      state.documentId = action.payload.documentId; // Fixed the key to match `initialState`
    },
    resetEditingState(state) {
      state.isEditing = false;
      state.documentId = null;
    },
    setLockPage(state) {
      state.isLocked = false;
      state.documentId = null;
    },
  },
});

export const { setEditingState, resetEditingState, setLockPage } = documentSlice.actions;
export default documentSlice.reducer;
