import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  openSettings: false,
  userdata: {
    id: '',
    username: '',
  },
};

const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    changeOpenSettings(state, action) {
      state.openSettings = action.payload;
    },
    changeUserdata(state, action) {
      state.userdata = { ...action.payload };
    },
  },
});

export default generalSlice.reducer;
export const { changeOpenSettings, changeUserdata } = generalSlice.actions;
