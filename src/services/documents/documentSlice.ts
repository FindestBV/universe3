import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DocumentState {
    documents: [];
    selectedDocument: null;
    filters: Record<string, string>;
}

const initialState: DocumentState = {
    documents: [],
    selectedDocument: null,
    filters: {},
};

const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSelectedDocument(state, action: PayloadAction<any>) {
            state.selectedDocument = action.payload;
        },
        setFilters(state, action: PayloadAction<Record<string, string>>) {
            state.filters = action.payload;
        },
        clearFilters(state) {
            state.filters = {};
        },
    },
});

export const { setSelectedDocument, setFilters, clearFilters } = documentSlice.actions;
export default documentSlice.reducer; // Ensure the default export is correct.
