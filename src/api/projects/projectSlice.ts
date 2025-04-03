import type {
  LinkedCounts,
  PageListItem,
  Project,
  ProjectOverview,
  RecentProjectActivities,
  Tab,
} from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProjectState {
  // Current project state
  currentProject: ProjectOverview | null;
  isEditing: boolean;
  isLocked: boolean;

  // Project dialog states
  isDialogOpen: boolean;
  isMinimized: boolean;
  dialogProjectId: string | null;

  // Project tabs
  tabs: Tab[];
  activeTabId: string | null;

  // Project content
  pages: PageListItem[];

  // Recent activities and projects
  recentActivities: RecentProjectActivities | null;
  recentProjects: Project[];

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Project settings
  isFollowing: boolean;
  visibility: "private" | "public";

  // Project search/filter
  searchTerm: string;
  filters: {
    type: string | null;
    dateRange: {
      start: string | null;
      end: string | null;
    };
    sortBy: "name" | "date" | "type";
    sortOrder: "asc" | "desc";
  };
}

const initialState: ProjectState = {
  currentProject: null,
  isEditing: false,
  isLocked: false,

  isDialogOpen: false,
  isMinimized: false,
  dialogProjectId: null,

  tabs: [],
  activeTabId: null,

  pages: [],

  recentActivities: null,
  recentProjects: [],

  isLoading: false,
  error: null,

  isFollowing: false,
  visibility: "private",

  searchTerm: "",
  filters: {
    type: null,
    dateRange: {
      start: null,
      end: null,
    },
    sortBy: "date",
    sortOrder: "desc",
  },
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    // Project editing state
    setEditingState: (
      state,
      action: PayloadAction<{ isEditing: boolean; projectId: string | null }>,
    ) => {
      state.isEditing = action.payload.isEditing;
      state.dialogProjectId = action.payload.projectId;
    },

    resetEditingState: (state) => {
      state.isEditing = false;
      state.dialogProjectId = null;
    },

    // Project locking
    setLockProject: (
      state,
      action: PayloadAction<{ isLocked: boolean; projectId: string | null }>,
    ) => {
      state.isLocked = action.payload.isLocked;
      state.dialogProjectId = action.payload.projectId;
    },

    // Dialog management
    openProjectDialog: (state, action: PayloadAction<{ projectId: string }>) => {
      state.isDialogOpen = true;
      state.dialogProjectId = action.payload.projectId;
      state.isMinimized = false;
    },

    closeProjectDialog: (state) => {
      state.isDialogOpen = false;
      state.dialogProjectId = null;
      state.isMinimized = false;
    },

    minimizeProjectDialog: (state) => {
      state.isMinimized = true;
    },

    restoreProjectDialog: (state) => {
      state.isMinimized = false;
    },

    // Project data management
    setCurrentProject: (state, action: PayloadAction<ProjectOverview>) => {
      state.currentProject = action.payload;
    },

    clearCurrentProject: (state) => {
      state.currentProject = null;
    },

    // Tab management
    setTabs: (state, action: PayloadAction<Tab[]>) => {
      state.tabs = action.payload;
    },

    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTabId = action.payload;
    },

    addTab: (state, action: PayloadAction<Tab>) => {
      state.tabs.push(action.payload);
    },

    removeTab: (state, action: PayloadAction<string>) => {
      state.tabs = state.tabs.filter((tab) => tab.id !== action.payload);
      if (state.activeTabId === action.payload) {
        state.activeTabId = state.tabs[0]?.id || null;
      }
    },

    updateTabOrder: (state, action: PayloadAction<string[]>) => {
      const orderedTabs = action.payload
        .map((id) => state.tabs.find((tab) => tab.id === id))
        .filter((tab): tab is Tab => tab !== undefined);
      state.tabs = orderedTabs;
    },

    // Update tab content
    updateTabContent: (state, action: PayloadAction<{ tabId: string; content: string }>) => {
      const tab = state.tabs.find((tab) => tab.id === action.payload.tabId);
      if (tab) {
        tab.content = action.payload.content;
      }
      if (state.currentProject?.tabs) {
        const currentTab = state.currentProject.tabs.find((tab) => tab.id === action.payload.tabId);
        if (currentTab) {
          currentTab.content = action.payload.content;
        }
      }
    },

    // Content management
    setPages: (state, action: PayloadAction<PageListItem[]>) => {
      state.pages = action.payload;
    },

    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Following state
    setFollowingState: (state, action: PayloadAction<boolean>) => {
      state.isFollowing = action.payload;
    },

    // Visibility
    setVisibility: (state, action: PayloadAction<"private" | "public">) => {
      state.visibility = action.payload;
    },

    // Search and filters
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },

    setFilters: (state, action: PayloadAction<Partial<ProjectState["filters"]>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.searchTerm = "";
    },

    // Recent activities and projects
    setRecentActivities: (state, action: PayloadAction<RecentProjectActivities>) => {
      state.recentActivities = action.payload;
    },

    setRecentProjects: (state, action: PayloadAction<Project[]>) => {
      state.recentProjects = action.payload;
    },
  },
});

export const {
  setEditingState,
  resetEditingState,
  setLockProject,
  openProjectDialog,
  closeProjectDialog,
  minimizeProjectDialog,
  restoreProjectDialog,
  setCurrentProject,
  clearCurrentProject,
  setTabs,
  setActiveTab,
  addTab,
  removeTab,
  updateTabOrder,
  updateTabContent,
  setPages,
  setLoading,
  setError,
  setFollowingState,
  setVisibility,
  setSearchTerm,
  setFilters,
  resetFilters,
  setRecentActivities,
  setRecentProjects,
} = projectSlice.actions;

export default projectSlice.reducer;
