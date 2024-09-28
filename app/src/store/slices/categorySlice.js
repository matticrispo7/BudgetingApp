import { createSlice } from "@reduxjs/toolkit";
import { setDropdownMainCategory } from "./dropdownSlice";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    name: "",
    mainCategory: "",
    type: "",
    isSubCategory: 0,
  },
  reducers: {
    setCategoryName(state, action) {
      const name = action.payload;
      return { ...state, name };
    },
    setMainCategoryName(state, action) {
      const mainCategory = action.payload;
      return { ...state, mainCategory };
    },
    setCategoryType(state, action) {
      const type = action.payload;
      return { ...state, type };
    },
    setIsSubCategory(state, action) {
      return { ...state, isSubCategory: action.payload };
    },
    resetCategory(state) {
      state.name = "";
      state.mainCategory = "";
      state.type = "";
      state.isSubCategory = 0;
    },
  },
  extraReducers(builder) {
    builder.addCase(setDropdownMainCategory, (state) => {
      return { ...state, isSubCategory: 1 };
    });
  },
});

export const {
  setCategoryName,
  setMainCategoryName,
  setCategoryType,
  setIsSubCategory,
  resetCategory,
} = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
