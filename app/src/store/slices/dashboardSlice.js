import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    linePlotData: [],
  },
  reducers: {
    setDashboardLinePlotData(state, action) {
      console.log("dashboard payload: ", action.payload);
      return { ...state, linePlotData: action.payload };
    },
  },
});

export const { setDashboardLinePlotData } = dashboardSlice.actions;
export const dashboardReducer = dashboardSlice.reducer;
