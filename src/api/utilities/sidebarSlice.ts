import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
  sidebarOpen: boolean;
}

const initialState: SidebarState = {
  sidebarOpen: true, // Open by default
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleInnerSidebar(state) {
      console.log("sidebar state", state);
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarState(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { toggleInnerSidebar, setSidebarState } = sidebarSlice.actions;
export default sidebarSlice.reducer;
