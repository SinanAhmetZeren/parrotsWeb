/* eslint-disable no-unused-vars */
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    isLoggedIn: !!localStorage.getItem("storedToken"),
    userId: "",
    token: "",
    refreshToken: "",
    userName: "",
    userProfileImage: "",
    userFavoriteVoyages: [0],
    userFavoriteVehicles: [0],
  },
  reducers: {
    updateAsLoggedIn: (state, action) => {
      try {
        state.isLoggedIn = true;
        state.userId = action.payload.userId;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.userName = action.payload.userName;
        state.userProfileImage = action.payload.profileImageUrl;
        localStorage.setItem("storedToken", action.payload.token);
        localStorage.setItem("storedRefreshToken", action.payload.refreshToken);
        localStorage.setItem("storedUserId", action.payload.userId);
        localStorage.setItem("storedUserName", action.payload.userName);
        localStorage.setItem(
          "storedProfileImageUrl",
          action.payload.profileImageUrl
        );
      } catch (error) {
        console.error("Error setting localStorage:", error);
      }
    },
    updateAsLoggedOut: (state) => {
      try {
        state.isLoggedIn = false;
        state.userId = "";
        state.token = "";
        state.refreshToken = "";
        state.userName = "";
        state.userProfileImage = "";
        localStorage.removeItem("storedToken");
        localStorage.removeItem("storedRefreshToken");
        localStorage.removeItem("storedUserId");
        localStorage.removeItem("storedUserName");
        localStorage.removeItem("storedProfileImageUrl");
        localStorage.removeItem("storedFavoriteVehicles");
        localStorage.removeItem("storedFavoriteVoyages");
      } catch (err) {
        console.error("Error setting localStorage:", err);
      }
    },
    updateStateFromLocalStorage: (state, action) => {
      const { token, userId, userName, profileImageUrl } = action.payload;
      state.userId = userId;
      state.token = token;
      state.userName = userName;
      state.userProfileImage = profileImageUrl;
      state.isLoggedIn = true;
    },
    updateUserData: (state, action) => {
      state.userProfileImage = action.payload.image;
    },
    updateUserName: (state, action) => {
      console.log("updateUserName action payload: ", action.payload);
      state.userName = action.payload.username;
    },
    updateUserFavorites: (state, action) => {
      localStorage.setItem(
        "storedFavoriteVehicles",
        JSON.stringify(action.payload.favoriteVehicles)
      );
      localStorage.setItem(
        "storedFavoriteVoyages",
        JSON.stringify(action.payload.favoriteVoyages)
      );
    },
    updateUserFavoriteVehicles: (state, action) => {
      if (action.payload.userFavoriteVehicles)
        localStorage.setItem(
          "storedFavoriteVehicles",
          JSON.stringify(action.payload.favoriteVehicles)
        );
    },
    addVoyageToUserFavorites: (state, action) => {
      const currentFavoriteVoyages =
        JSON.parse(localStorage.getItem("storedFavoriteVoyages")) || [];
      if (!Array.isArray(currentFavoriteVoyages)) {
        console.error(
          "Error: currentFavoriteVoyages is not an array",
          currentFavoriteVoyages
        );
        return;
      }
      const updatedFavoriteVoyages = [
        ...currentFavoriteVoyages,
        action.payload.favoriteVehicle,
      ];
      localStorage.setItem(
        "storedFavoriteVoyages",
        JSON.stringify(updatedFavoriteVoyages)
      );
    },
    removeVoyageFromUserFavorites: (state, action) => {
      const voyageToRemove = action.payload.favoriteVoyage;
      const currentFavoriteVoyages =
        JSON.parse(localStorage.getItem("storedFavoriteVoyages")) || [];
      if (!Array.isArray(currentFavoriteVoyages)) {
        console.error(
          "Error: currentFavoriteVoyages is not an array",
          currentFavoriteVoyages
        );
        return;
      }
      const updatedFavoriteVoyages = currentFavoriteVoyages.filter(
        (voyage) => voyage !== voyageToRemove
      );
      localStorage.setItem(
        "storedFavoriteVoyages",
        JSON.stringify(updatedFavoriteVoyages)
      );
    },
    addVehicleToUserFavorites: (state, action) => {
      const currentFavoriteVehicles =
        JSON.parse(localStorage.getItem("storedFavoriteVehicles")) || [];
      if (!Array.isArray(currentFavoriteVehicles)) {
        console.error(
          "Error: currentFavoriteVehicles is not an array",
          currentFavoriteVehicles
        );
        return;
      }
      const updatedFavoriteVehicles = [
        ...currentFavoriteVehicles,
        action.payload.favoriteVehicle,
      ];
      localStorage.setItem(
        "storedFavoriteVehicles",
        JSON.stringify(updatedFavoriteVehicles)
      );
    },
    removeVehicleFromUserFavorites: (state, action) => {
      const vehicleToRemove = action.payload.favoriteVehicle;
      const currentFavoriteVehicles =
        JSON.parse(localStorage.getItem("storedFavoriteVehicles")) || [];
      if (!Array.isArray(currentFavoriteVehicles)) {
        console.error(
          "Error: currentFavoriteVehicles is not an array",
          currentFavoriteVehicles
        );
        return;
      }
      const updatedFavoriteVehicles = currentFavoriteVehicles.filter(
        (vehicle) => vehicle !== vehicleToRemove
      );
      localStorage.setItem(
        "storedFavoriteVehicles",
        JSON.stringify(updatedFavoriteVehicles)
      );
    },
  },
});

export const {
  updateAsLoggedIn,
  updateAsLoggedOut,
  updateStateFromLocalStorage,
  updateUserData,
  updateUserName,
  updateUserFavorites,
  updateUserFavoriteVehicles,
  addVoyageToUserFavorites,
  removeVoyageFromUserFavorites,
  addVehicleToUserFavorites,
  removeVehicleFromUserFavorites,
} = usersSlice.actions;

export default usersSlice.reducer;

// -------------- USER API
const usersAdapter = createEntityAdapter({});
const initialState = usersAdapter.getInitialState({});
export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsersByUsername: builder.query({
      query: (username) => {
        if (username) {
          return `/api/User/searchUsers/${username}`;
        } else {
          return "";
        }
      },
      transformResponse: (responseData) => responseData.data,
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/api/account/register",
        method: "POST",
        body: userData,
      }),
    }),
    confirmUser2: builder.mutation({
      query: (confirmData) => ({
        url: "/api/account/confirmCode",
        method: "POST",
        body: confirmData,
      }),
    }),
    confirmUser: builder.mutation({
      query: (confirmData) => {
        console.log("confirmData:--->", confirmData);
        return {
          url: "/api/account/confirmCode",
          method: "POST",
          body: confirmData,
        };
      },
    }),
    requestCode: builder.mutation({
      query: (email) => ({
        url: `/api/account/sendCode/${email}`,
        method: "POST",
      }),
    }),
    resetPassword: builder.mutation({
      query: (resetPasswordData) => ({
        url: `/api/account/resetPassword`,
        method: "POST",
        body: resetPasswordData,
      }),
    }),
    loginUser: builder.mutation({
      query: (userData) => ({
        url: "/api/account/login",
        method: "POST",
        body: userData,
      }),
    }),
    googleLoginInternal: builder.mutation({
      query: (AccessToken) => ({
        url: "/api/account/google-login",
        method: "POST",
        body: { AccessToken },
      }),
    }),
    getUserById: builder.query({
      query: (userId) => {
        if (userId) {
          return `/api/User/getUserById/${userId}`;
        } else {
          return undefined;
        }
      },
      transformResponse: (responseData) => responseData.data,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),
    /*
    updateProfileImage2: builder.mutation({
      query: (data) => {
        const { formData, userId } = data;
        return {
          url: `/api/User/${userId}/updateProfileImage`,
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            // Add any other headers if needed
          },
          body: formData,
        };
      },

      invalidatesTags: [],
    }),
    */
    /*
    updateBackgroundImage2: builder.mutation({
      query: (data) => {
        const { formData, userId } = data;
        return {
          url: `/api/User/${userId}/updateBackgroundImage`,
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        };
      },

      invalidatesTags: [],
    }),
    */
    updateProfileImage: builder.mutation({
      query: (data) => {
        const { profileImage, userId } = data;
        console.log("profileImage--->> ", profileImage);
        const formData = new FormData();
        formData.append("imageFile", profileImage);
        const url = `/api/User/${userId}/updateProfileImage`;
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
    updateBackgroundImage: builder.mutation({
      query: (data) => {
        const { backGroundImage, userId } = data;
        console.log("backGroundImage: ", backGroundImage);
        const formData = new FormData();
        formData.append("imageFile", backGroundImage);
        const url = `/api/User/${userId}/updateBackgroundImage`;
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
    patchUser: builder.mutation({
      query: ({ userId, patchDoc }) => {
        return {
          url: `/api/User/PatchUser/${userId}`,
          method: "PATCH",
          body: patchDoc,
        };
      },
    }),
    getFavoriteVoyageIdsByUserId: builder.query({
      query: (userId) => {
        if (userId) {
          return `/api/Favorite/getFavoriteVoyageIdsByUserId/${userId}`;
        } else {
          return "";
        }
      },
      transformResponse: (responseData) => responseData.data,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),
    getFavoriteVehicleIdsByUserId: builder.query({
      query: (userId) => {
        if (userId) {
          return `/api/Favorite/getFavoriteVehicleIdsByUserId/${userId}`;
        } else {
          return "";
        }
      },
      transformResponse: (responseData) => responseData.data,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),
  }),
  overrideExisting: true,
});
export const {
  useGetUsersByUsernameQuery,
  //
  useGetFavoriteVoyageIdsByUserIdQuery,
  useLazyGetFavoriteVoyageIdsByUserIdQuery,
  //
  useGetFavoriteVehicleIdsByUserIdQuery,
  useLazyGetFavoriteVehicleIdsByUserIdQuery,
  useRegisterUserMutation,
  useRequestCodeMutation,
  useConfirmUserMutation,
  useLoginUserMutation,
  useGoogleLoginInternalMutation,
  useResetPasswordMutation,
  useGetUserByIdQuery,
  useUpdateProfileImageMutation,
  useUpdateBackgroundImageMutation,
  usePatchUserMutation,
} = extendedApiSlice;
