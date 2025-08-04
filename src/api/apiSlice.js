/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useNavigate } from "react-router-dom";
const API_URL = "https://adapting-sheepdog-annually.ngrok-free.app";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: async (headers) => {
    headers.set("ngrok-skip-browser-warning", "1");
    const token = await localStorage.getItem("storedToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem("storedRefreshToken");
    if (!refreshToken) {
      return result;
    }
    const refreshResult = await baseQuery(
      {
        url: "/api/account/refresh-token",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );
    console.log("Refresh result:", refreshResult);
    if (refreshResult.data) {
      localStorage.setItem("storedToken", refreshResult.data.token);
      localStorage.setItem(
        "storedRefreshToken",
        refreshResult.data.refreshToken
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      localStorage.removeItem("storedToken");
      localStorage.removeItem("storedRefreshToken");
      window.location.href = "/login";
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Voyage"],
  endpoints: (builder) => ({}),
});
