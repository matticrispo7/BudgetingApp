import { configureStore } from "@reduxjs/toolkit";
import { categoriesApi } from "./api/categoriesApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userReducer, setUsername } from "./slices/userSlice";
import {
  categoryReducer,
  setCategoryName,
  setMainCategoryName,
  setCategoryType,
  setIsSubCategory,
  resetCategory,
} from "./slices/categorySlice";
import {
  dropdownReducer,
  setDropdownCategoryType,
  setDropdownDataCategory,
  setDropdownMainCategory,
  setDropdownCategoryToFilter,
  setDropdownYearExpense,
} from "./slices/dropdownSlice";
import {
  setDataDescription,
  setDataCategory,
  setDataTimestamp,
  setDataTotal,
  setData,
  resetData,
  dataReducer,
} from "./slices/dataSlice";
import {
  setPaginationCurrentPage,
  resetPage,
  paginationReducer,
} from "./slices/paginationSlice";
import {
  setDashboardLinePlotData,
  dashboardReducer,
} from "./slices/dashboardSlice";
import {
  setFilterDateRange,
  setFilterCategory,
  setFilterText,
  resetFilterText,
  resetFilter,
  filterReducer,
} from "./slices/filterSlice";

import { dataApi } from "./api/dataApi";

const store = configureStore({
  reducer: {
    user: userReducer,
    category: categoryReducer,
    dropdown: dropdownReducer,
    data: dataReducer,
    filter: filterReducer,
    pagination: paginationReducer,
    dashboard: dashboardReducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [dataApi.reducerPath]: dataApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(categoriesApi.middleware)
      .concat(dataApi.middleware);
  },
});
setupListeners(store.dispatch);

// RTK
export {
  useFetchCategoriesPerUserQuery,
  useCreateCategoryMutation,
  usePatchUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchTotPagesPerUserQuery,
} from "./api/categoriesApi";
export {
  useFetchDataPerUserQuery,
  useFetchDataPerUserLastPeriodQuery,
  useCreateDataMutation,
  usePatchUpdateDataMutation,
  useDeleteDataMutation,
  useFetchTotDataPagesPerUserQuery,
  useFetchAggregateTotalPerUserLastPeriodQuery,
  useFetchDataPerUserLastYearQuery,
  useFetchListOfYearsPerUserQuery,
} from "./api/dataApi";

// REDUX
export {
  store,
  setUsername,
  setCategoryName,
  setIsSubCategory,
  resetCategory,
  setMainCategoryName,
  setCategoryType,
  setDropdownCategoryType,
  setDropdownDataCategory,
  setDropdownMainCategory,
  setDropdownCategoryToFilter,
  setDropdownYearExpense,
  setDataDescription,
  setDataCategory,
  setDataTimestamp,
  setDataTotal,
  setData,
  resetData,
  setFilterCategory,
  setFilterDateRange,
  setFilterText,
  resetFilterText,
  resetFilter,
  setPaginationCurrentPage,
  resetPage,
  setDashboardLinePlotData,
};
