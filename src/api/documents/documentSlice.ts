import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DocumentState {
  isEditing: boolean;
  documentId: string | null;
}

const initialState: DocumentState = {
  isEditing: false,
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
  },
});

export const { setEditingState, resetEditingState } = documentSlice.actions;
export default documentSlice.reducer;
