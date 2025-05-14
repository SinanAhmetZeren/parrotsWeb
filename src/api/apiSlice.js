/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = "https://measured-wolf-grossly.ngrok-free.app";

const apiSlice2 = createApi({
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

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: async (...args) => {
    const rawBaseQuery = fetchBaseQuery({
      baseUrl: "https://measured-wolf-grossly.ngrok-free.app",
      prepareHeaders: async (headers) => {
        headers.set("ngrok-skip-browser-warning", "1");
        const token = await localStorage.getItem("token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    });

    // fetchBaseQuery doesn't support async prepareHeaders directly, so we wrap it here
    return rawBaseQuery(...args);
  },

  tagTypes: ["User", "Voyage"],

  endpoints: (builder) => ({}),
});
