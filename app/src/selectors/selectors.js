import { createSelector } from "reselect";

// Selectors to get specific slices of state
const getData = (state) => state.data;
const getDropdown = (state) => state.dropdown;
const getCategory = (state) => state.category;

// Create a memoized selector using createSelector
export const getUpdatedData = createSelector(
  [getData, getDropdown], // Input selectors
  (data, dropdown) => {
    // Use the input selectors to compute the derived data
    return {
      timestamp: data.timestamp,
      description: data.description,
      category: dropdown.dataCategory,
      total: data.total,
    };
  }
);

// Create a memoized selector using createSelector
export const getCategoryData = createSelector(
  [getCategory, getDropdown], // Input selectors
  (category, dropdown) => {
    // Use the input selectors to compute the derived data
    return {
      name: category.name,
      type: dropdown.categoryType,
      mainCategory: dropdown.mainCategory,
      isSubCategory: category.isSubCategory,
    };
  }
);
