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
        getWeeklyVoyages: builder.query({
            query: () => "/api/Metrics/weeklyVoyages",
            transformResponse: (responseData) => responseData.data,
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
        }),
        getWeeklyVehicles: builder.query({
            query: () => "/api/Metrics/weeklyVehicles",
            transformResponse: (responseData) => responseData.data,
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
        }),
        getWeeklyUsers: builder.query({
            query: () => "/api/Metrics/weeklyUsers",
            transformResponse: (responseData) => responseData.data,
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
        }),
        getWeeklyBids: builder.query({
            query: () => "/api/Metrics/weeklyBids",
            transformResponse: (responseData) => responseData.data,
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
        }),
        getWeeklyMessages: builder.query({
            query: () => "/api/Metrics/weeklyMessages",
            transformResponse: (responseData) => responseData.data,
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetWeeklyPurchasesQuery,
    useGetWeeklyTransactionsQuery,
    useGetWeeklyVoyagesQuery,
    useGetWeeklyVehiclesQuery,
    useGetWeeklyUsersQuery,
    useGetWeeklyBidsQuery,
    useGetWeeklyMessagesQuery

} = extendedMetricsApi;