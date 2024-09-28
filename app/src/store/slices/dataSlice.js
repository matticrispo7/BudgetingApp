import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    description: "",
    category: "",
    timestamp: 0,
    total: 0,
  },
  reducers: {
    setDataDescription: (state, action) => {
      console.log(`[DataSlice] Action: ${JSON.stringify(action)}`);
      return { ...state, description: action.payload };
    },
    setDataCategory: (state, action) => {
      return { ...state, category: action.payload };
    },
    setDataTimestamp: (state, action) => {
      return { ...state, timestamp: action.payload };
    },
    setDataTotal: (state, action) => {
      return { ...state, total: action.payload };
    },
    setData: (state, action) => {
      let { timestamp, description, category, total } = action.payload;
      return { ...state, timestamp, description, category, total };
    },
    resetData: (state) => {
      return {
        ...state,
        description: "",
        total: 0,
        timestamp: new Date().getTime(),
      };
    },
  },
});

export const {
  setDataDescription,
  setDataCategory,
  setDataTimestamp,
  setDataTotal,
  setData,
  resetData,
} = dataSlice.actions;
export const dataReducer = dataSlice.reducer;
