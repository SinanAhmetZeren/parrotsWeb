import parrotsLogo from "./assets/parrots-logo-mini.png";
import randomImage from "./assets/amazonForest.jpg";
import "./App.css";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import * as React from "react";

function App() {
  const userId = "43242342432342342342";
  const myApiKey = "AIzaSyAsqIXNMISkZ0eprGc2iTLbiQk0QBtgq0c";
  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = {
    lat: 37.7749,
    lng: -122.4194,
  };

  return (
    <div className="App">
      <header className="App-header">
        <div
          className="grid sm:grid-rows-9 sm:grid-cols-9
         grid-rows-[auto,auto,1fr] grid-cols-1 w-full h-screen"
        >
          <div
            className="sm:row-span-1 sm:col-span-3 sm:bg-gray-800 
           row-span-1 col-span-1 bg-blue-100 
           text-white flex items-center 
           sm:justify-start justify-center p-4 h-[100px] sm:h-auto"
          >
            <img src={parrotsLogo} alt="Logo" className="w-10 h-10 mr-4" />
            <div>
              <p className="text-lg font-semibold">Welcome to Parrots</p>
              <p className="text-lg text-yellow-400">Username</p>
            </div>
          </div>

          <div
            className="sm:row-span-1 sm:col-span-6 sm:bg-gray-700 
           row-span-1 col-span-1 bg-blue-200 
           text-white flex items-center justify-center sm:justify-end p-4 h-[100px] sm:h-auto"
          >
            <nav className="flex space-x-6 sm:space-x-6 overflow-x-auto sm:overflow-x-visible">
              <a href="#home" className="hover:text-gray-300">
                Home
              </a>
              <a href="#profile" className="hover:text-gray-300">
                Profile
              </a>
              <a href="#voyage" className="hover:text-gray-300">
                Voyage
              </a>
              <a href="#favorites" className="hover:text-gray-300">
                Favorites
              </a>
              <a href="#connect" className="hover:text-gray-300">
                Connect
              </a>
              <a href="#logout" className="hover:text-gray-300">
                Logout
              </a>
            </nav>
          </div>

          <div
            className="sm:row-span-8 sm:col-span-3 sm:bg-amber-600 
           row-span-6 col-span-1 bg-blue-300 
           flex items-center justify-center order-4 sm:order-3 h-[500px] sm:h-auto"
          >
            <div class="max-w-sm rounded overflow-hidden shadow-lg bg-white ">
              <img class="w-full h-96 object-cover" src={randomImage} alt="" />
              <div class="px-6 py-4">
                <h2 class="text-xl font-bold mb-2 text-purple-800">
                  Card Title
                </h2>
                <h3 class="text-lg text-gray-700 mb-2">Card Subtitle</h3>
                <p class="text-gray-600">
                  This is an explanation for the card. It provides some
                  additional details about the content shown in the card.
                </p>
              </div>
            </div>
          </div>

          <div
            className="sm:row-span-8 sm:col-span-6 sm:bg-amber-100 
                    row-span-6 col-span-1 bg-blue-300 
                    flex items-center justify-center order-4 sm:order-3"
            style={{ height: "100%", padding: ".1rem" }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "1rem",
                overflow: "hidden",
              }}
            >
              <LoadScript googleMapsApiKey={myApiKey}>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={10}
                />
              </LoadScript>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
