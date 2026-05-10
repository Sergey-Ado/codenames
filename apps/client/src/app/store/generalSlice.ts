import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  openSettings: false,
  userdata: {
    id: '',
    username: '',
  },
  openAvatarMenu: false,
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
    changeOpenAvatarMenu(state, action) {
      state.openAvatarMenu = action.payload;
    },
  },
});

export default generalSlice.reducer;
export const { changeOpenSettings, changeUserdata, changeOpenAvatarMenu } =
  generalSlice.actions;
