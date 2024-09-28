import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { dataApi } from "./dataApi";
import { baseURL } from "../../utils";

const categoriesApi = createApi({
  reducerPath: "categories",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseURL}/api`,
    // Provide headers, including the Authorization header for JWT token
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints(builder) {
    return {
      fetchCategoriesPerUser: builder.query({
        providesTags: (result, error, arg) => {
          return [{ type: "Category", userId: arg.userId }];
        },
        query: (arg) => {
          //console.log("[API] fetchAllCategoriesPerUser: ", arg);

          if (!arg.userId) {
            return;
          }

          let params = {};
          if (arg?.page) {
            params.page = arg.page;
          }
          if (arg?.batchData) {
            params.batchData = arg.batchData;
          }
          if (arg?.isSubCategory) {
            params.isSubCategory = arg.isSubCategory;
          }
          params.userId = arg.userId;
          //console.log("fetchCategoriesPerUser PARAMS: ", params);
          return {
            url: "/categories",
            params: params,
            method: "GET",
          };
        },
      }),
      fetchTotPagesPerUser: builder.query({
        query: (userid) => {
          return {
            url: `/categories/pages/user/${userid}`,
            method: "GET",
          };
        },
      }),
      createCategory: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          // TODO: check tags
          //console.log(
          //  "createCategory invalidate tag with userId: ",
          //  arg.userId
          //);
          return [{ type: "Category", userId: arg.userId }];
        },
        query: (data) => {
          const { name, mainCategory, type, userId } = data;
          const isSubCategory = mainCategory ? 1 : 0;
          return {
            url: "/categories",
            method: "POST",
            body: {
              type,
              userId,
              name,
              isSubCategory: isSubCategory,
              mainCategory: mainCategory,
            },
          };
        },
      }),
      patchUpdateCategory: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          // 1) invalidate the query (of categoryAPI) to force refetching all the data
          // 2) invalidate also the query (of dataAPI) to refetch the data to show in the dashboard
          return [{ type: "Category", userId: arg.userId }];
        },
        query: (data) => {
          const { id, categoryName, type, mainCategory, isSubCategory } = data;
          let body = {};
          if (categoryName) {
            body.categoryName = categoryName;
          }
          if (type) {
            body.type = type;
          }
          if (mainCategory) {
            body.mainCategory = mainCategory;
          }
          if (isSubCategory) {
            body.isSubCategory = isSubCategory;
            body.mainCategory = mainCategory;
          } else if (isSubCategory === 0) {
            body.mainCategory = "";
            body.isSubCategory = isSubCategory;
          }
          return {
            url: `/categories/${id}`,
            method: "PATCH",
            body: body,
          };
        },
        // below is used to invalidate a query (with a given TAG) of a different API
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          //console.log("************ onQueryStarted arg: ", arg);
          await queryFulfilled;
          dispatch(
            dataApi.util.invalidateTags([
              { type: "Data", id: "DataList" },
              { type: "Data", userId: arg.userId },
            ])
          );
        },
      }),
      deleteCategory: builder.mutation({
        invalidatesTags: () => {
          return ["Category"];
        },
        query: (categoryId) => {
          return {
            url: `/categories/${categoryId}`,
            method: "DELETE",
            body: {
              id: categoryId,
            },
          };
        },
      }),
    };
  },
});

export const {
  useFetchCategoriesPerUserQuery,
  useCreateCategoryMutation,
  usePatchUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchTotPagesPerUserQuery,
} = categoriesApi;
export { categoriesApi };
