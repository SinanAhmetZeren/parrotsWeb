/* eslint-disable no-unused-vars */
import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

// Use entity adapter if you want normalized data, optional
const metricsAdapter = createEntityAdapter({});

const initialState = metricsAdapter.getInitialState();

export const extendedMetricsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getWeeklyPurchases: builder.query({
            query: () => "/api/Metrics/weeklyPurchases",
            transformResponse: (responseData) => responseData.data,
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
        }),
        getWeeklyTransactions: builder.query({
            query: () => "/api/Metrics/weeklyTransactions",
            transformResponse: (responseData) => responseData.data,
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetWeeklyPurchasesQuery,
    useGetWeeklyTransactionsQuery

} = extendedMetricsApi;