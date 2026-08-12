import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const API_URL = process.env.REACT_APP_API_URL || "https://api.parrotsvoyages.com";
const API_URL = window.location.hostname === "localhost"
  ? "https://localhost:7151"
  : "https://api.parrotsvoyages.com";

const aiBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  timeout: 60000,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("storedToken");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const aiBaseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await aiBaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem("storedRefreshToken");
    if (refreshToken) {
      const refreshResult = await aiBaseQuery(
        { url: "/api/account/refresh-token", method: "POST", body: { refreshToken } },
        api,
        extraOptions
      );
      if (refreshResult.data) {
        localStorage.setItem("storedToken", refreshResult.data.token);
        localStorage.setItem("storedRefreshToken", refreshResult.data.refreshToken);
        result = await aiBaseQuery(args, api, extraOptions);
      } else {
        localStorage.removeItem("storedToken");
        localStorage.removeItem("storedRefreshToken");
        localStorage.removeItem("storedUserId");
        localStorage.removeItem("storedUserName");
        localStorage.removeItem("storedProfileImageUrl");
        sessionStorage.setItem("sessionExpired", "1");
        window.location.href = "/login";
      }
    } else {
      sessionStorage.setItem("sessionExpired", "1");
      window.location.href = "/login";
    }
  }
  return result;
};

export const aiApiSlice = createApi({
  reducerPath: "aiApi",
  baseQuery: aiBaseQueryWithReauth,
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
