/* eslint-disable no-unused-vars */
import { apiSlice } from "../api/apiSlice";

export const healthApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    healthCheck: builder.query({
      query: () => `/api/health`,
      transformResponse: (responseData) => {
        console.log("Health check response:", responseData);
        return responseData;
      },
    }),
  }),
});

export const { useHealthCheckQuery } = healthApiSlice;
