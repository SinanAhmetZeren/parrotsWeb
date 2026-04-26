/* eslint-disable no-unused-vars */
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    isLoggedIn: !!localStorage.getItem("storedToken"),
    userId: localStorage.getItem("storedUserId"),
    token: localStorage.getItem("storedToken"),
    refreshToken: localStorage.getItem("storedRefreshToken"),
    userName: localStorage.getItem("storedUserName"),
    userProfileImage: localStorage.getItem("storedProfileImageUrl"),
    userFavoriteVoyages: [0],
    userFavoriteVehicles: [0],
    bookmarkedUserIds: JSON.parse(localStorage.getItem("storedBookmarkedUserIds")) || [],
    unreadMessages: false,
    isAdmin: false,
    hasAcknowledgedPublicProfile: localStorage.getItem("storedAcknowledgedPublicProfile") === "true",
    isDarkMode: localStorage.getItem("storedIsDarkMode") !== "false",
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
        state.unreadMessages = action.payload.unreadMessages;
        state.isAdmin = action.payload.isAdmin;
        state.hasAcknowledgedPublicProfile = action.payload.hasAcknowledgedPublicProfile ?? false;
        localStorage.setItem("storedAcknowledgedPublicProfile", String(action.payload.hasAcknowledgedPublicProfile ?? false));

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
        state.unreadMessages = false;
        state.isAdmin = false;
        state.hasAcknowledgedPublicProfile = false;

        localStorage.removeItem("storedToken");
        localStorage.removeItem("storedRefreshToken");
        localStorage.removeItem("storedUserId");
        localStorage.removeItem("storedUserName");
        localStorage.removeItem("storedProfileImageUrl");
        localStorage.removeItem("storedFavoriteVehicles");
        localStorage.removeItem("storedFavoriteVoyages");
        localStorage.removeItem("storedBookmarkedUserIds");
        localStorage.removeItem("storedAcknowledgedPublicProfile");
        state.bookmarkedUserIds = [];
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
    /*
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
    */
    updateUserFavorites: (state, action) => {
      const { favoriteVehicles, favoriteVoyages } = action.payload || {};
      if (favoriteVehicles !== undefined) {
        localStorage.setItem(
          "storedFavoriteVehicles",
          JSON.stringify(favoriteVehicles)
        );
      }

      if (favoriteVoyages !== undefined) {
        localStorage.setItem(
          "storedFavoriteVoyages",
          JSON.stringify(favoriteVoyages)
        );
      }
    },
    setAcknowledgedPublicProfile: (state) => {
      state.hasAcknowledgedPublicProfile = true;
      localStorage.setItem("storedAcknowledgedPublicProfile", "true");
    },
    updateUserFavoriteVehicles: (state, action) => {
      if (action.payload.userFavoriteVehicles)
        localStorage.setItem(
          "storedFavoriteVehicles",
          JSON.stringify(action.payload.favoriteVehicles)
        );
    },
    updateUserFavoriteVoyages: (state, action) => {
      if (action.payload.userFavoriteVoyages)
        localStorage.setItem(
          "storedFavoriteVoyages",
          JSON.stringify(action.payload.favoriteVoyages)
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
        action.payload.favoriteVoyage,
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

    setBookmarkedUserIds: (state, action) => {
      state.bookmarkedUserIds = action.payload;
      localStorage.setItem("storedBookmarkedUserIds", JSON.stringify(action.payload));
    },
    addBookmarkedUserId: (state, action) => {
      if (!state.bookmarkedUserIds.includes(action.payload)) {
        state.bookmarkedUserIds = [...state.bookmarkedUserIds, action.payload];
        localStorage.setItem("storedBookmarkedUserIds", JSON.stringify(state.bookmarkedUserIds));
      }
    },
    removeBookmarkedUserId: (state, action) => {
      state.bookmarkedUserIds = state.bookmarkedUserIds.filter(id => id !== action.payload);
      localStorage.setItem("storedBookmarkedUserIds", JSON.stringify(state.bookmarkedUserIds));
    },
    setUnreadMessages: (state, action) => {
      state.unreadMessages = action.payload;
    },
    markMessagesRead: (state) => {
      state.unreadMessages = false;
    },
    setIsDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
      localStorage.setItem("storedIsDarkMode", String(action.payload));
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
  updateUserFavoriteVoyages,
  addVoyageToUserFavorites,
  removeVoyageFromUserFavorites,
  addVehicleToUserFavorites,
  removeVehicleFromUserFavorites,
  setUnreadMessages,
  markMessagesRead,
  setAcknowledgedPublicProfile,
  setIsDarkMode,
  setBookmarkedUserIds,
  addBookmarkedUserId,
  removeBookmarkedUserId,
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
      keepUnusedDataFor: 0,
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/api/account/register",
        method: "POST",
        body: userData,
      }),
    }),
    /*
    confirmUser2: builder.mutation({
      query: (confirmData) => ({
        url: "/api/account/confirmCode",
        method: "POST",
        body: confirmData,
      }),
    }),
    */
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
    acceptTerms: builder.mutation({
      query: () => ({
        url: "/api/account/accept-terms",
        method: "POST",
      }),
    }),
    acknowledgePublicProfile: builder.mutation({
      query: () => ({
        url: "/api/account/acknowledge-public-profile",
        method: "POST",
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
    getSingleUserByUserName: builder.query({
      query: (userName) => {
        if (userName) {
          return `/api/User/singleUserByUsername/${userName}`;
        } else {
          return undefined;
        }
      },
      transformResponse: (responseData) => responseData.data,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),
    getUserByPublicId: builder.query({
      query: (userId) => {
        if (userId) {
          return `/api/User/getUserByPublicId/${userId}`;
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
        console.log(userId);
        return {
          url: `/api/User/PatchUser/${userId}`,
          method: "PATCH",
          body: patchDoc,
        };
      },
    }),
    patchUserAdmin: builder.mutation({
      query: ({ userId, patchDoc }) => {
        console.log(userId);
        return {
          url: `/api/User/PatchUserAdmin/${userId}`,
          method: "PATCH",
          body: patchDoc,
        };
      },
    }),
    purchaseCoins: builder.mutation({
      query: ({ userId, coins, eurAmount, paymentProviderId }) => ({
        url: `/api/User/PurchaseCoins`,
        method: "POST",
        body: {
          userId,
          coins,
          eurAmount,
          paymentProviderId
        },
      }),
    }),
    claimFreeCoins: builder.mutation({
      query: () => ({
        url: `/api/User/ClaimFreeCoins`,
        method: "POST",
      }),
    }),
    sendParrotCoins: builder.mutation({
      query: ({ userId, coins, receiverId }) => ({
        url: `/api/User/sendParrotCoins`,
        method: "POST",
        body: {
          userId,
          coins,
          receiverId
        },
      }),
    }),
    getParrotCoinBalance: builder.query({
      query: (userId) => {
        if (userId) {
          return `/api/User/parrotCoinBalance/${userId}`;
        } else {
          return "";
        }
      },
      transformResponse: (responseData) => responseData.data,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
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
    getBookmarks: builder.query({
      query: () => `/api/Bookmark/getBookmarks`,
      transformResponse: (responseData) => responseData.data,
      providesTags: ["Bookmarks"],
    }),
    getBookmarkedUserIds: builder.query({
      query: () => `/api/Bookmark/getBookmarkedUserIds`,
      transformResponse: (responseData) => responseData.data,
    }),
    addBookmark: builder.mutation({
      query: (bookmarkedUserId) => ({
        url: `/api/Bookmark/addBookmark/${bookmarkedUserId}`,
        method: "POST",
      }),
      transformResponse: (responseData) => responseData.data,
      invalidatesTags: ["Bookmarks"],
    }),
    removeBookmark: builder.mutation({
      query: (bookmarkedUserId) => ({
        url: `/api/Bookmark/removeBookmark/${bookmarkedUserId}`,
        method: "DELETE",
      }),
      transformResponse: (responseData) => responseData.data,
      invalidatesTags: ["Bookmarks"],
    }),
  }),
  overrideExisting: true,
});
export const {
  useGetUsersByUsernameQuery,
  useLazyGetUsersByUsernameQuery,
  useGetSingleUserByUserNameQuery,
  useLazyGetSingleUserByUserNameQuery,
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
  useAcceptTermsMutation,
  useAcknowledgePublicProfileMutation,
  useGoogleLoginInternalMutation,
  useResetPasswordMutation,
  useGetUserByIdQuery,
  useGetUserByPublicIdQuery,
  useLazyGetUserByIdQuery,
  useUpdateProfileImageMutation,
  useUpdateBackgroundImageMutation,
  usePatchUserMutation,
  usePatchUserAdminMutation,
  usePurchaseCoinsMutation,
  useClaimFreeCoinsMutation,
  useSendParrotCoinsMutation,
  useGetParrotCoinBalanceQuery,
  useLazyGetParrotCoinBalanceQuery,
  useGetBookmarksQuery,
  useLazyGetBookmarksQuery,
  useGetBookmarkedUserIdsQuery,
  useLazyGetBookmarkedUserIdsQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} = extendedApiSlice;
