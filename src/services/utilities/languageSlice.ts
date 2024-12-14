// store/languageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LanguageState = {
  selectedLanguage: string;
};

const initialState: LanguageState = {
  selectedLanguage: 'en', // Default language
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.selectedLanguage = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
