import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openSettings: false,
};

const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {},
});

export default generalSlice.reducer;
