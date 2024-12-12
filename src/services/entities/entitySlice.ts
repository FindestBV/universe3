import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { entityApi } from './entityApi'; // Assuming you have your API slice in a separate file
import { Entity, EntityState } from '../../types/types'; 

const initialState: EntityState = {
    entities: [],
    selectedEntity: null,
    isLoading: false,
    error: null,
    filters: {
        id: '',
        title: '',
        type: '',
    },
};

const entitySlice = createSlice({
    name: 'entity',
    initialState,
    reducers: {
        // Set all entities
        setEntities: (state, action: PayloadAction<Entity[]>) => {
            state.entities = action.payload;
            state.error = null;
        },
        
        // Set selected entity
        setSelectedEntity: (state, action: PayloadAction<Entity | null>) => {
            state.selectedEntity = action.payload;
        },
        
        // Update filters
        setFilters: (state, action: PayloadAction<EntityState['filters']>) => {
            state.filters = {
                ...state.filters,
                ...action.payload,
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
        
        // Clear entity state
        clearEntities: (state) => {
            state.entities = [];
            state.selectedEntity = null;
            state.filters = initialState.filters;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Handle API slice actions and match loading, success, and error states

        // Fetch all entities
        builder
            .addMatcher(
                entityApi.endpoints.getEntities.matchPending,
                (state) => {
                    state.isLoading = true;
                }
            )
            .addMatcher(
                entityApi.endpoints.getEntities.matchFulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.entities = action.payload;
                    state.error = null;
                }
            )
            .addMatcher(
                entityApi.endpoints.getEntities.matchRejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.error.message ?? 'Failed to fetch entities';
                }
            )

        // Fetch entity by ID
        builder
            .addMatcher(
                entityApi.endpoints.getEntityById.matchPending,
                (state) => {
                    state.isLoading = true;
                }
            )
            .addMatcher(
                entityApi.endpoints.getEntityById.matchFulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.selectedEntity = action.payload;
                    state.error = null;
                }
            )
            .addMatcher(
                entityApi.endpoints.getEntityById.matchRejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.error.message ?? 'Failed to fetch entity';
                }
            )

        // Create entity
        builder
            .addMatcher(
                entityApi.endpoints.createEntity.matchPending,
                (state) => {
                    state.isLoading = true;
                }
            )
            .addMatcher(
                entityApi.endpoints.createEntity.matchFulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.entities.push(action.payload);
                    state.error = null;
                }
            )
            .addMatcher(
                entityApi.endpoints.createEntity.matchRejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.error.message ?? 'Failed to create entity';
                }
            )

        // Update entity title
        builder
            .addMatcher(
                entityApi.endpoints.updateEntityTitle.matchPending,
                (state) => {
                    state.isLoading = true;
                }
            )
            .addMatcher(
                entityApi.endpoints.updateEntityTitle.matchFulfilled,
                (state, action) => {
                    state.isLoading = false;
                    const index = state.entities.findIndex((entity) => entity.id === action.payload.id);
                    if (index !== -1) {
                        state.entities[index] = action.payload; // Update the entity title
                    }
                    state.error = null;
                }
            )
            .addMatcher(
                entityApi.endpoints.updateEntityTitle.matchRejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.error.message ?? 'Failed to update entity title';
                }
            )

        // Delete entity
        builder
            .addMatcher(
                entityApi.endpoints.deleteEntity.matchPending,
                (state) => {
                    state.isLoading = true;
                }
            )
            .addMatcher(
                entityApi.endpoints.deleteEntity.matchFulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.entities = state.entities.filter((entity) => entity.id !== action.payload.id);
                    state.error = null;
                }
            )
            .addMatcher(
                entityApi.endpoints.deleteEntity.matchRejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.error.message ?? 'Failed to delete entity';
                }
            )
    }
});

// Export actions
export const {
    setEntities,
    setSelectedEntity,
    setFilters,
    clearFilters,
    setLoading,
    setError,
    clearEntities,
} = entitySlice.actions;

// Export selectors
export const selectAllEntities = (state: { entity: EntityState }) => state.entity.entities;
export const selectSelectedEntity = (state: { entity: EntityState }) => state.entity.selectedEntity;
export const selectEntityFilters = (state: { entity: EntityState }) => state.entity.filters;
export const selectEntityLoading = (state: { entity: EntityState }) => state.entity.isLoading;
export const selectEntityError = (state: { entity: EntityState }) => state.entity.error;

// Export reducer
export default entitySlice.reducer;
