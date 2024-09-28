import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: "",
    username: "",
    balance: 0,
    token: "",
    refreshToken: "",
  },
  reducers: {
    setUsername(state, action) {
      const username = action.payload;
      return { ...state, username };
    },
    setToken(state, action) {
      const token = action.payload;
      return { ...state, token };
    },
    setUserData(state, action) {
      return { ...state, ...action.payload };
    },
    resetUser(state) {
      return {
        ...state,
        id: "",
        username: "",
        balance: 0,
        token: "",
        refreshToken: "",
      };
    },
  },
});

export const { setUsername, setToken, setUserData, resetUser } =
  userSlice.actions;
export const userReducer = userSlice.reducer;
