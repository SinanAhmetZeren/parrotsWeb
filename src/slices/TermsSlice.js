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
    checkRequiresTermsAcceptance: builder.query({
      query: () => "/api/account/requires-terms-acceptance",
    }),
    getCurrentTermsPublic: builder.query({
      query: () => "/api/account/current-terms",
    }),
  }),
});

export const { useGetCurrentTermsAdminQuery, useUpdateTermsAdminMutation, useLazyCheckRequiresTermsAcceptanceQuery, useGetCurrentTermsPublicQuery } =
  extendedApiSlice;
