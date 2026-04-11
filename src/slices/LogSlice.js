import { apiSlice } from "../api/apiSlice";

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLogs: builder.query({
      query: ({ from, to, level } = {}) => {
        const params = new URLSearchParams();
        if (from) params.append("from", from);
        if (to) params.append("to", to);
        if (level && level !== "ALL") params.append("level", level);
        return `/api/account/admin/logs?${params.toString()}`;
      },
    }),
  }),
});

export const { useLazyGetLogsQuery } = extendedApiSlice;
