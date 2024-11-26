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
        <img src={profileImageUrl} className="App-logo" alt="logo" />
        {isSuccessUser ? (
          <>
            <p>{userData.userName}</p>
            <p>{userData.title}</p>
            <p>{userData.bio}</p>
          </>
        ) : (
          <p>Loading or no data available...</p>
        )}
      </header>
    </div>
  );
}

export default App;
