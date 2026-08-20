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
        getAiQueryStats: builder.query({
            query: ({ from, to } = {}) => {
                const search = new URLSearchParams();
                if (from) search.append("from", `${from}T00:00:00Z`);
                if (to) {
                    const next = new Date(to);
                    next.setDate(next.getDate() + 1);
                    search.append("to", next.toISOString().slice(0, 10) + "T00:00:00Z");
                }
                return `/api/Metrics/aiQueryStats?${search.toString()}`;
            },
            transformResponse: (responseData) => responseData.data,
            keepUnusedDataFor: 0,
        }),
        getMinVersion: builder.query({
            query: () => "/api/version",
        }),
        updateMinVersion: builder.mutation({
            query: ({ version, forceUpdate }) => ({
                url: "/api/version/minVersion",
                method: "PUT",
                body: { version, forceUpdate },
            }),
            transformResponse: (responseData) => responseData,
        }),
        getAiQueries: builder.query({
            query: (params) => {
                const search = new URLSearchParams();
                Object.entries(params).forEach(([k, v]) => {
                    if (v !== undefined && v !== null && v !== "") {
                        if (k === "to" && typeof v === "string" && v.length === 10) {
                            const next = new Date(v);
                            next.setDate(next.getDate() + 1);
                            search.append(k, next.toISOString().slice(0, 10) + "T00:00:00Z");
                        }
                        else if (k === "from" && typeof v === "string" && v.length === 10)
                            search.append(k, `${v}T00:00:00Z`);
                        else
                            search.append(k, v);
                    }
                });
                return `/api/Metrics/aiQueries?${search.toString()}`;
            },
            transformResponse: (responseData) => responseData.data,
            keepUnusedDataFor: 0,
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
    useGetWeeklyMessagesQuery,
    useGetAiQueriesQuery,
    useGetAiQueryStatsQuery,
    useGetMinVersionQuery,
    useUpdateMinVersionMutation,
} = extendedMetricsApi;