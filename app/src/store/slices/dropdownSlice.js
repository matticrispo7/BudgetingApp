import { createSlice } from "@reduxjs/toolkit";
import { resetCategory } from "./categorySlice";
import { resetData, setData } from "./dataSlice";

const dropdownSlice = createSlice({
  name: "dropdown",
  initialState: {
    mainCategory: "",
    categoryType: "",
    dataCategory: "",
    categoryToFilter: "",
    yearExpense: new Date().getFullYear(),
  },
  reducers: {
    setDropdownMainCategory(state, action) {
      return { ...state, mainCategory: action.payload };
    },
    setDropdownCategoryType(state, action) {
      return { ...state, categoryType: action.payload };
    },
    setDropdownDataCategory(state, action) {
      return { ...state, dataCategory: action.payload };
    },
    setDropdownCategoryToFilter(state, action) {
      return { ...state, categoryToFilter: action.payload };
    },
    setDropdownYearExpense(state, action) {
      return { ...state, yearExpense: action.payload };
    },
  },
  extraReducers(builder) {
    builder.addCase(resetCategory, (state) => {
      return { ...state, mainCategory: "", categoryType: "" };
    });
    builder.addCase(setData, (state, action) => {
      return { ...state, dataCategory: action.payload.category };
    });
    builder.addCase(resetData, (state) => {
      return { ...state, dataCategory: "" };
    });
  },
});

export const {
  setDropdownMainCategory,
  setDropdownCategoryType,
  setDropdownDataCategory,
  setDropdownCategoryToFilter,
  setDropdownYearExpense,
} = dropdownSlice.actions;
export const dropdownReducer = dropdownSlice.reducer;
