import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openSettings: false,
};

const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    changeOpenSettings(state, action) {
      state.openSettings = action.payload;
    },
  },
});

export default generalSlice.reducer;
export const { changeOpenSettings } = generalSlice.actions;
