/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useNavigate } from "react-router-dom";
const API_URL = "https://adapting-sheepdog-annually.ngrok-free.app";
// const API_URL = "https://parrots-api-backend.azurewebsites.net";
// const API_URL = "https://api.parrotsvoyages.com";

const generateDeviceId = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

const getDeviceId = () => {
  let id = localStorage.getItem("deviceId");
  if (!id) {
    id = generateDeviceId();
    localStorage.setItem("deviceId", id);
  }
  return id;
};

const deviceId = getDeviceId();

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    headers.set("ngrok-skip-browser-warning", "1");
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("deviceId", deviceId);
    }
    headers.set("X-Device-Id", deviceId);

    const token = localStorage.getItem("storedToken");
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
