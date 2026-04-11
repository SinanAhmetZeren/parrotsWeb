/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// const API_URL = "https://adapting-sheepdog-annually.ngrok-free.app";
// const API_URL = "https://parrots-api-backend.azurewebsites.net";
const API_URL = process.env.REACT_APP_API_URL || "https://api.parrotsvoyages.com";

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
  timeout: 15000,
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
      localStorage.removeItem("storedUserId");
      localStorage.removeItem("storedUserName");
      localStorage.removeItem("storedProfileImageUrl");
      sessionStorage.setItem("sessionExpired", "1");
      window.location.href = "/login";
    }
  }
  if (result.error) {
    const status = result.error.status;
    if (status === 500) toast.error("Server error. Please try again later.", { toastId: "err500" });
    else if (status === 503) toast.error("Service unavailable. The server may be down.", { toastId: "err503" });
    else if (status === "FETCH_ERROR") toast.error("Cannot reach the server. Check your connection.", { toastId: "fetchErr" });
    else if (status === "TIMEOUT_ERROR") toast.error("Request timed out. Please try again.", { toastId: "timeout" });
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Voyage"],
  endpoints: (builder) => ({}),
});
