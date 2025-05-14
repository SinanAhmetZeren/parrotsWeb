/* eslint-disable no-unused-vars */
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const voyagesAdapter = createEntityAdapter({});

const initialState = voyagesAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVoyagesByUserById: builder.query({
      query: (userId) => {
        const token = localStorage.getItem("storedToken");
        return {
          url: `/api/Voyage/GetVoyageByUserId/${userId}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      transformResponse: (responseData) => responseData.data,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),

    getVoyageById2: builder.query({
      query: (voyageId) => {
        const token = localStorage.getItem("storedToken");
        return {
          url: `/api/Voyage/GetVoyageById/${voyageId}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      transformResponse: (responseData) => responseData.data,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),

    getVoyageById: builder.query({
      query: (voyageId) => {
        const token = localStorage.getItem("storedToken");
        return {
          url: `/api/Voyage/GetVoyageById/${voyageId}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      transformResponse: (responseData) => responseData.data,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),

    createVoyage: builder.mutation({
      query: (data) => {
        const {
          voyageImage,
          name,
          brief,
          description,
          vacancy,
          formattedStartDate,
          formattedEndDate,
          formattedLastBidDate,
          minPrice,
          maxPrice,
          isAuction,
          isFixedPrice,
          userId,
          vehicleId,
        } = data;

        const formData = new FormData();
        formData.append("imageFile", voyageImage);

        const queryParams = new URLSearchParams({
          Name: name,
          Brief: brief,
          Description: description,
          Vacancy: vacancy,
          StartDate: formattedStartDate,
          EndDate: formattedEndDate,
          LastBidDate: formattedLastBidDate,
          MinPrice: minPrice,
          MaxPrice: maxPrice,
          Auction: isAuction.toString(),
          FixedPrice: isFixedPrice.toString(),
          UserId: userId,
          VehicleId: vehicleId,
        });

        const token = localStorage.getItem("storedToken");

        return {
          url: `/api/Voyage/AddVoyage?${queryParams}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        };
      },
    }),

    confirmVoyage: builder.mutation({
      query: (voyageId) => {
        const token = localStorage.getItem("storedToken");
        return {
          url: `/api/Voyage/confirmVoyage/${voyageId}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    checkAndDeleteVoyage: builder.mutation({
      query: (voyageId) => {
        const token = localStorage.getItem("storedToken");
        return {
          url: `/api/Voyage/checkAndDeleteVoyage/${voyageId}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    addVoyageImage: builder.mutation({
      query: (data) => {
        const { voyageImage, voyageId } = data;
        const formData = new FormData();
        formData.append("imageFile", voyageImage);
        const token = localStorage.getItem("storedToken");

        return {
          url: `/api/Voyage/${voyageId}/AddVoyageImage`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        };
      },
    }),

    deleteVoyageImage: builder.mutation({
      query: (imageId) => {
        const token = localStorage.getItem("storedToken");
        return {
          url: `/api/Voyage/${imageId}/deleteVoyageImage`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    sendBid: builder.mutation({
      query: (bidData) => {
        const token = localStorage.getItem("storedToken");
        return {
          url: "/api/Bid/createBid",
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            ...bidData,
            dateTime: new Date().toISOString(),
          },
        };
      },
    }),

    changeBid: builder.mutation({
      query: (bidData) => {
        const { bidId, message, offerPrice, personCount } = bidData;
        const token = localStorage.getItem("storedToken");
        return {
          url: "/api/Bid/changeBid",
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            id: bidId,
            personCount,
            message,
            offerPrice,
            dateTime: new Date().toISOString(),
          },
        };
      },
    }),

    acceptBid: builder.mutation({
      query: (bidId) => {
        const token = localStorage.getItem("storedToken");
        return {
          url: `/api/Bid/acceptbid?bidId=${bidId}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: { bidId },
        };
      },
    }),

    addWaypoint: builder.mutation({
      query: (data) => {
        const {
          waypointImage,
          latitude,
          longitude,
          title,
          description,
          voyageId,
          order,
        } = data;

        const queryParams = new URLSearchParams({
          Latitude: latitude,
          Longitude: longitude,
          Title: title,
          Description: description,
          VoyageId: voyageId,
          Order: order,
        });

        const formData = new FormData();
        formData.append("imageFile", waypointImage);

        const token = localStorage.getItem("storedToken");

        return {
          url: `/api/Waypoint/AddWaypoint?${queryParams}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        };
      },
    }),

    deleteWaypoint: builder.mutation({
      query: ({ waypointId }) => {
        const token = localStorage.getItem("storedToken");
        return {
          url: `/api/Waypoint/deleteWaypoint/${waypointId}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    getVoyagesByLocation: builder.mutation({
      query: ({ lat1, lat2, lon1, lon2 }) => {
        const token = localStorage.getItem("storedToken");
        return {
          url: `/api/Voyage/GetVoyagesByCoords/${lat1}/${lat2}/${lon1}/${lon2}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      transformResponse: (responseData) => responseData.data,
    }),

    getFilteredVoyages: builder.mutation({
      query: (data) => {
        const {
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta,
          count,
          selectedVehicleType,
          formattedStartDate,
          formattedEndDate,
        } = data;

        const queryParams = new URLSearchParams({
          Lat1: (latitude - latitudeDelta / 2).toString(),
          Lat2: (latitude + latitudeDelta / 2).toString(),
          Lon1: (longitude - longitudeDelta / 2).toString(),
          Lon2: (longitude + longitudeDelta / 2).toString(),
          Vacancy: count.toString(),
        });

        if (selectedVehicleType) {
          queryParams.append("VehicleType", selectedVehicleType);
        }

        if (formattedStartDate) {
          queryParams.append("StartDate", formattedStartDate);
        }

        if (formattedEndDate) {
          queryParams.append("EndDate", formattedEndDate);
        }

        const token = localStorage.getItem("storedToken");

        return {
          url: `/api/Voyage/GetFilteredVoyages?${queryParams}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      transformResponse: (responseData) => responseData.data,
    }),

    getFavoriteVoyagesByUserId: builder.query({
      query: (userId) => {
        const token = localStorage.getItem("storedToken");
        return {
          url: `/api/Favorite/getFavoriteVoyagesByUserId/${userId}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      transformResponse: (responseData) => responseData.data,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),

    addVoyageToFavorites: builder.mutation({
      query: ({ userId, voyageId }) => {
        const token = localStorage.getItem("storedToken");
        return {
          url: `/api/Favorite/addFavorite`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: {
            userId,
            type: "voyage",
            itemId: voyageId,
          },
        };
      },
    }),

    deleteVoyageFromFavorites: builder.mutation({
      query: ({ userId, voyageId }) => {
        const token = localStorage.getItem("storedToken");
        return {
          url: `/api/Favorite/deleteFavoriteVoyage/${userId}/${voyageId}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateVoyageMutation,
  useAddVoyageImageMutation,
  useAddWaypointMutation,
  useConfirmVoyageMutation,
  useDeleteWaypointMutation,
  useDeleteVoyageImageMutation,
  useCheckAndDeleteVoyageMutation,
  useGetVoyagesByUserByIdQuery,
  useGetVoyageByIdQuery,
  useSendBidMutation,
  useChangeBidMutation,
  useAcceptBidMutation,
  useGetVoyagesByLocationMutation,
  useGetFilteredVoyagesMutation,
  useGetFavoriteVoyagesByUserIdQuery,
  useAddVoyageToFavoritesMutation,
  useDeleteVoyageFromFavoritesMutation,
} = extendedApiSlice;
