import { createSlice } from "@reduxjs/toolkit";

const paginationSlice = createSlice({
  name: "pagination",
  initialState: {
    currentPage: 1,
  },
  reducers: {
    setPaginationCurrentPage(state, action) {
      return { ...state, currentPage: action.payload };
    },
    resetPage(state) {
      state.currentPage = 1;
    },
  },
});

export const { setPaginationCurrentPage, resetPage } = paginationSlice.actions;
export const paginationReducer = paginationSlice.reducer;
