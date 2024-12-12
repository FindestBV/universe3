import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define interfaces for the document state
interface Document {
    id: string;
    url: string;
    title: string;
    type: string; 
    abstract: string;
    // Add other document properties as needed
}

interface DocumentState {
    documents: Document[];
    selectedDocument: Document | null;
    isLoading: boolean;
    error: string | null;
    filters: {
        id?: string;
        name?: string;
        title?: string;
    };
}

const initialState: DocumentState = {
    documents: [],
    selectedDocument: null,
    isLoading: false,
    error: null,
    filters: {
        id: '',
        name: '',
        title: ''
    }
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        // Set all documents
        setDocuments: (state, action: PayloadAction<Document[]>) => {
            state.documents = action.payload;
            state.error = null;
        },
        
        // Set selected document
        setSelectedDocument: (state, action: PayloadAction<Document | null>) => {
            state.selectedDocument = action.payload;
        },
        
        // Update filters
        setFilters: (state, action: PayloadAction<DocumentState['filters']>) => {
            state.filters = {
                ...state.filters,
                ...action.payload
            };
        },
        
        // Clear filters
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        
        // Set loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        
        // Set error state
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        
        // Clear document state
        clearDocuments: (state) => {
            state.documents = [];
            state.selectedDocument = null;
            state.filters = initialState.filters;
            state.error = null;
        }
    },
});

// Export actions
export const {
    setDocuments,
    setSelectedDocument,
    setFilters,
    clearFilters,
    setLoading,
    setError,
    clearDocuments
} = searchSlice.actions;

// // Export selectors
// export const selectAllDocuments = (state: { document: DocumentState }) => 
//     state.document.documents;

// export const selectSelectedDocument = (state: { document: DocumentState }) => 
//     state.document.selectedDocument;

// export const selectDocumentFilters = (state: { document: DocumentState }) => 
//     state.document.filters;

// export const selectDocumentLoading = (state: { document: DocumentState }) => 
//     state.document.isLoading;

// export const selectDocumentError = (state: { document: DocumentState }) => 
//     state.document.error;

// Export reducer
export default searchSlice.reducer;