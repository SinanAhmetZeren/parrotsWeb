/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = "https://measured-wolf-grossly.ngrok-free.app";

export const apiSlice = createApi({
  reducerPath: "api",
  // baseQuery: fetchBaseQuery({
  //   baseUrl: API_URL,
  // }),

  baseQuery: fetchBaseQuery({
    baseUrl: "https://measured-wolf-grossly.ngrok-free.app",
    prepareHeaders: (headers, { getState }) => {
      headers.set("ngrok-skip-browser-warning", "1");
      return headers;
    },
  }),

  endpoints: (builder) => ({}),
  tagTypes: ["User", "Voyage"],
});
