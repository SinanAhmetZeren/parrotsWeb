/* eslint-disable no-unused-vars */
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const voyagesAdapter = createEntityAdapter({});

const initialState = voyagesAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVoyagesByUserById: builder.query({
      query: (userId) => `/api/Voyage/GetVoyageByUserId/${userId}`,
      transformResponse: (responseData) => {
        return responseData.data;
      },
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),
    getVoyageById: builder.query({
      query: (voyageId) => `/api/Voyage/GetVoyageById/${voyageId}`,
      transformResponse: (responseData) => {
        return responseData.data;
      },
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


        const url = `/api/Voyage/AddVoyage?${queryParams}`;

        return {
          url,
          method: "POST",
          headers: {
            // "Content-Type": "multipart/form-data",
          },
          body: formData,
        };
      },
      // ... other configuration options
    }),
    confirmVoyage: builder.mutation({
      query: (voyageId) => ({
        url: `/api/Voyage/confirmVoyage/${voyageId}`,
        method: "POST",
      }),
    }),
    checkAndDeleteVoyage: builder.mutation({
      query: (voyageId) => ({
        url: `/api/Voyage/checkAndDeleteVoyage/${voyageId}`,
        method: "DELETE",
      }),
    }),
    /*
    addVoyageImage: builder.mutation({
      query: (data) => {
        const { formData, voyageId } = data;
        const url = `/api/Voyage/${voyageId}/AddVoyageImage`;
        return {
          url,
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        };
      },
    }),
*/
    addVoyageImage: builder.mutation({
      query: (data) => {
        const { voyageImage, voyageId } = data;
        const formData = new FormData();
        console.log("voyageId:...", voyageId);
        console.log("voyageImage:...", voyageImage);
        formData.append("imageFile", voyageImage);
        const url = `/api/Voyage/${voyageId}/AddVoyageImage`;
        return {
          url,
          method: "POST",
          headers: {
            // "Content-Type": "multipart/form-data",
          },
          body: formData,
        };
      },
    }),
    deleteVoyageImage: builder.mutation({
      query: (imageId) => ({
        url: `/api/Voyage/${imageId}/deleteVoyageImage`,
        method: "DELETE",
      }),
    }),
    sendBid: builder.mutation({
      query: (bidData) => {
        console.log("biddata:", bidData);
        return {
          url: "/api/Bid/createBid",
          method: "POST",
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
        const formattedBidData = {
          id: bidId,
          personCount,
          message,
          offerPrice,
        };

        console.log("formattedBidData:", personCount, offerPrice, message);

        return {
          url: "/api/Bid/changeBid",
          method: "POST",
          body: {
            ...formattedBidData,
            dateTime: new Date().toISOString(),
          },
        };
      },
    }),
    acceptBid: builder.mutation({
      query: (bidId) => ({
        url: `/api/Bid/acceptbid?bidId=${bidId}`,
        method: "POST",
        body: { bidId },
      }),
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
        const url = `/api/Waypoint/AddWaypoint?${queryParams}`;
        const formData = new FormData();
        formData.append("imageFile", waypointImage);
        return {
          url,
          method: "POST",
          headers: {
            // "Content-Type": "multipart/form-data",
          },
          body: formData,
        };
      },
    }),
    deleteWaypoint: builder.mutation({
      query: (data) => {
        const { waypointId } = data;
        return {
          url: `/api/Waypoint/deleteWaypoint/${waypointId}`,
          method: "DELETE",
        };
      },
    }),
    getVoyagesByLocation: builder.mutation({
      query: (data) => {
        const { lat1, lat2, lon1, lon2 } = data;
        return `/api/Voyage/GetVoyagesByCoords/${lat1}/${lat2}/${lon1}/${lon2}`;
      },
      transformResponse: (responseData) => {
        return responseData.data;
      },
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

        console.log("data: ", data);

        const queryParams = new URLSearchParams({
          Lat1: (latitude - latitudeDelta / 2).toString(),
          Lat2: (latitude + latitudeDelta / 2).toString(),
          Lon1: (longitude - longitudeDelta / 2).toString(),
          Lon2: (longitude + longitudeDelta / 2).toString(),
          Vacancy: count.toString(),
        });

        if (selectedVehicleType !== undefined && selectedVehicleType !== null) {
          queryParams.append("VehicleType", selectedVehicleType);
        }

        if (formattedStartDate !== null) {
          queryParams.append("StartDate", formattedStartDate);
        }

        if (formattedEndDate !== null) {
          queryParams.append("EndDate", formattedEndDate);
        }

        console.log("queryParams:", queryParams);
        const endpoint = `/api/Voyage/GetFilteredVoyages?${queryParams.toString()}`;

        return endpoint;
      },
      transformResponse: (responseData) => {
        return responseData.data;
      },
    }),
    getFavoriteVoyagesByUserId: builder.query({
      query: (userId) => `/api/Favorite/getFavoriteVoyagesByUserId/${userId}`,
      transformResponse: (responseData) => {
        return responseData.data;
      },
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),
    addVoyageToFavorites: builder.mutation({
      query: (data) => {
        const { userId, voyageId } = data;

        const body = {
          userId: userId,
          type: "voyage",
          itemId: voyageId,
        };
        const url = `/api/Favorite/addFavorite`;
        return {
          url,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        };
      },
    }),
    deleteVoyageFromFavorites: builder.mutation({
      query: (data) => {
        const { userId, voyageId } = data;
        return {
          url: `/api/Favorite/deleteFavoriteVoyage/${userId}/${voyageId}`,
          method: "DELETE",
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
