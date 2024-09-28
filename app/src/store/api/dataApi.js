import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../../utils";

const dataApi = createApi({
  reducerPath: "dataApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseURL}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  //tagTypes: ["Data"],
  endpoints(builder) {
    return {
      fetchDataPerUser: builder.query({
        providesTags: (result) => {
          const tags = result
            ? [
                ...result.map(({ id }) => ({ type: "Data", id })),
                { type: "Data" },
              ]
            : [{ type: "Data" }];
          console.log(`fetchData tags`);
          tags.map((t) => console.log(JSON.stringify(t)));
          return tags;
        },
        query: (arg) => {
          // TODO: use the spread operator to build 'params'
          let params = {};
          if (arg?.page) {
            params.page = arg.page;
          }
          if (arg?.batchData) {
            params.batchData = arg.batchData;
          }
          if (arg?.filterCategory) {
            params.filterCategory = arg.filterCategory;
          }
          if (arg?.filterDateRange) {
            params.filterDateRange = arg.filterDateRange;
          }
          if (arg?.filterText) {
            params.filterText = arg.filterText;
          }
          params.userId = arg.userId;
          return {
            url: "/data",
            params: params,
            method: "GET",
          };
        },
      }),
      fetchDataPerUserLastPeriod: builder.query({
        providesTags: (result, error, arg) => {
          return [{ type: "Data", userId: arg.userId }];
        },
        query: ({ userId, days }) => {
          return {
            url: `/data/user/${userId}`,
            params: {
              days: days,
            },
            method: "GET",
          };
        },
      }),
      fetchAggregateTotalPerUserLastPeriod: builder.query({
        providesTags: (result, error, arg) => {
          return [{ type: "Data", userId: arg.userId }];
        },
        query: ({ userId, dateRange }) => {
          let params;
          if (dateRange) {
            params = { tsStart: dateRange[0], tsEnd: dateRange[1] };
          }

          return {
            url: `/data/aggregated/user/${userId}`,
            params: params,
            method: "GET",
          };
        },
      }),
      // TODO: merge this query into the one above
      fetchDataPerUserLastYear: builder.query({
        providesTags: (result, error, arg) => {
          return [{ type: "Data", userId: arg.userId }];
        },
        query: ({ userId, year }) => {
          return {
            url: `/data/year/user/${userId}`,
            params: {
              year: year,
            },
            method: "GET",
          };
        },
      }),
      createData: builder.mutation({
        invalidatesTags: () => {
          return [{ type: "Data" }];
        },
        query: (data) => {
          console.log("[DataAPI] CreateData: ", data);
          let { description, timestamp, category, total, userId } = data;
          return {
            url: "/data",
            method: "POST",
            body: {
              userId,
              description,
              timestamp,
              category,
              total,
            },
          };
        },
      }),
      patchUpdateData: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          // invalidate only the tag for the data with the given id
          console.log(`patchUpdateData invalidate: ${arg.id}`);
          return [{ type: "Data", id: arg.id }];
        },
        query: (data) => {
          // TODO: add the userId in the payload
          const { id, timestamp, description, category, total } = data;
          let body = {};
          if (timestamp) {
            body.timestamp = timestamp;
          }
          if (description) {
            body.description = description;
          }
          if (category) {
            body.category = category;
          }
          if (total) {
            body.total = total;
          }
          return {
            url: `/data/${id}`,
            method: "PATCH",
            body: body,
          };
        },
      }),
      deleteData: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          return [{ type: "Data", id: arg.id }];
        },
        query: (arg) => {
          return {
            url: `/data/${arg.dataId}`,
            method: "DELETE",
          };
        },
      }),
      fetchTotDataPagesPerUser: builder.query({
        providesTags: (result, error, arg) => {
          return [{ type: "Data", userId: arg }];
        },
        query: (userid) => {
          return {
            url: `/data/pages/user/${userid}`,
            method: "GET",
          };
        },
      }),
      fetchListOfYearsPerUser: builder.query({
        providesTags: (result, error, arg) => {
          return [{ type: "Data", userId: arg }];
        },
        query: (arg) => {
          return {
            url: `/data/years/user/${arg.userId}`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const {
  useFetchDataPerUserQuery,
  useFetchDataPerUserLastPeriodQuery,
  useCreateDataMutation,
  usePatchUpdateDataMutation,
  useDeleteDataMutation,
  useFetchTotDataPagesPerUserQuery,
  useFetchAggregateTotalPerUserLastPeriodQuery,
  useFetchDataPerUserLastYearQuery,
  useFetchListOfYearsPerUserQuery,
} = dataApi;
export { dataApi };
