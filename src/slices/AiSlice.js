import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.REACT_APP_API_URL || "https://api.parrotsvoyages.com";

const aiBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  timeout: 60000,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("storedToken");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const aiApiSlice = createApi({
  reducerPath: "aiApi",
  baseQuery: aiBaseQuery,
  endpoints: (builder) => ({
    askParrots: builder.mutation({
      query: (body) => ({
        url: "/api/Ai/ask",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAskParrotsMutation } = aiApiSlice;
