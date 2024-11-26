import parrotsLogo from "./assets/parrots-logo-mini.png";
import "./App.css";

/* eslint-disable react/display-name */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { Provider } from "react-redux";
import {
  useGetUserByIdQuery,
  useGetFavoriteVoyageIdsByUserIdQuery,
  useGetFavoriteVehicleIdsByUserIdQuery,
  updateStateFromLocalStorage,
  updateUserFavorites,
} from "./slices/UserSlice";

function App() {
  const userId = "43242342432342342342";

  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    isSuccess: isSuccessUser,
    refetch: refetchUserData,
  } = useGetUserByIdQuery(userId);

  if (isSuccessUser) console.log("userdata ", userData);
  const API_URL = "https://measured-wolf-grossly.ngrok-free.app";
  const profileImageUrl = `${API_URL}/Uploads/UserImages/05a574ef-ec3f-45e1-a9f3-2015c9092295.jpg`;

  return (
    <div className="App">
      <header className="App-header">
        <div
          class="grid sm:grid-rows-9 sm:grid-cols-9
         grid-rows-[auto,auto,1fr] grid-cols-1 w-full h-screen"
        >
          <div
            class="sm:row-span-1 sm:col-span-3 sm:bg-gray-800 
           row-span-1 col-span-1 bg-blue-100 
           text-white flex items-center 
           sm:justify-start justify-center p-4 h-[100px] sm:h-auto"
          >
            <img src={parrotsLogo} alt="Logo" class="w-10 h-10 mr-4" />
            <div>
              <p class="text-lg font-semibold">Welcome to Parrots</p>
              <p class="text-lg text-yellow-400">Username</p>
            </div>
          </div>

          <div
            class="sm:row-span-1 sm:col-span-6 sm:bg-gray-700 
           row-span-1 col-span-1 bg-blue-200 
           text-white flex items-center justify-center sm:justify-end p-4 h-[100px] sm:h-auto"
          >
            <nav class="flex space-x-6 sm:space-x-6 overflow-x-auto sm:overflow-x-visible">
              <a href="#home" class="hover:text-gray-300">
                Home
              </a>
              <a href="#profile" class="hover:text-gray-300">
                Profile
              </a>
              <a href="#voyage" class="hover:text-gray-300">
                Voyage
              </a>
              <a href="#favorites" class="hover:text-gray-300">
                Favorites
              </a>
              <a href="#connect" class="hover:text-gray-300">
                Connect
              </a>
              <a href="#logout" class="hover:text-gray-300">
                Logout
              </a>
            </nav>
          </div>

          <div
            class="sm:row-span-8 sm:col-span-3 sm:bg-amber-600 
           row-span-6 col-span-1 bg-blue-300 
           flex items-center justify-center order-4 sm:order-3 h-[300px] sm:h-auto"
          >
            Bottom Left
          </div>
          <div
            class="sm:row-span-8 sm:col-span-6 sm:bg-amber-500 
           row-span-6 col-span-1 bg-blue-400 
           flex items-center justify-center order-3 sm:order-4 h-[300px] sm:h-auto"
          >
            Bottom Right
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
