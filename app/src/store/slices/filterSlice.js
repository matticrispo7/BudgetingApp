import { createSlice } from "@reduxjs/toolkit";
import { setDropdownCategoryToFilter } from "./dropdownSlice";

const filterSlice = createSlice({
  name: "filter",
  initialState: {
    category: "",
    dateRange: [0, 0],
    textToSearch: "",
  },
  reducers: {
    setFilterDateRange(state, action) {
      return { ...state, dateRange: action.payload };
    },
    setFilterCategory(state, action) {
      return { ...state, category: action.payload };
    },
    setFilterText(state, action) {
      return { ...state, textToSearch: action.payload };
    },
    resetFilterDateRange(state) {
      return { ...state, dateRange: [0, 0] };
    },
    resetFilterText(state) {
      return { ...state, textToSearch: "" };
    },
    resetFilter(state) {
      state.category = "";
      state.dateRange = [0, 0];
      state.textToSearch = "";
    },
  },
  extraReducers(builder) {
    builder.addCase(setDropdownCategoryToFilter, (state, action) => {
      return { ...state, category: action.payload };
    });
  },
});

export const {
  setFilterDateRange,
  setFilterCategory,
  setFilterText,
  resetFilter,
  resetFilterText,
  resetFilterDateRange,
} = filterSlice.actions;
export const filterReducer = filterSlice.reducer;
