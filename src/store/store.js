import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { aiApiSlice } from "../slices/AiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import usersReducer from "../slices/UserSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [aiApiSlice.reducerPath]: aiApiSlice.reducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, aiApiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
