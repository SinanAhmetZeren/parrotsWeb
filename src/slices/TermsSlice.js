import { apiSlice } from "../api/apiSlice";

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentTermsAdmin: builder.query({
      query: () => "/api/account/admin/current-terms",
    }),
    updateTermsAdmin: builder.mutation({
      query: (body) => ({
        url: "/api/account/admin/update-terms",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetCurrentTermsAdminQuery, useUpdateTermsAdminMutation } =
  extendedApiSlice;
