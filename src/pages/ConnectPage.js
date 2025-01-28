/* eslint-disable no-undef */
import "../assets/css/advancedmarker.css";
import "../assets/css/ConnectPage.css";
import React, { useState, useEffect, useRef } from "react";

import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { useNavigate } from "react-router-dom";

import { useGetMessagesByUserIdQuery } from "../slices/MessageSlice";
import { useGetUsersByUsernameQuery } from "../slices/UserSlice";
import { MessagePreviewsComponent } from "../components/MessagePreviewsComponent";
import { SearchUserComponent } from "../components/SearchUserComponent";

function ConnectPage() {
  const userId = "1bf7d55e-7be2-49fb-99aa-93d947711e32";
  const navigate = useNavigate();
  const handleGoToUser = (user) => {
    console.log("go to user: ", user.userName);
  }
  const [username, setUsername] = useState("bbb");
  const [query, setQuery] = useState("");

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isError: isErrorMessages,
    error: errorMessages,
    isSuccess: isSuccessMessages,
    refetch,
  } = useGetMessagesByUserIdQuery(userId);

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUser,
    isSuccess: isSuccessUsers,
    refetch: refetchUsers,
  } = useGetUsersByUsernameQuery(username);

  useEffect(() => {
    // console.log("messagesData: ", messagesData);
  }, [messagesData]);

  return (
    isLoadingMessages ? (
      <div style={spinnerContainer}>
        <div className="spinner"></div>
      </div>
    ) : isSuccessMessages ? (
      <div className="App">
        <header className="App-header">
          <div className="flex mainpage_Container">
            <div className="flex mainpage_TopRow">
              <TopLeftComponent userName={"Peter Parker"} />
              <div className="flex mainpage_TopRight">
                <TopBarMenu />
              </div>
            </div>
            <div className="flex connectPage_Bottom">
              <div className="flex connectPage_BottomLeft">
                <SearchUserComponent query={query} setQuery={setQuery} />
                {query.length > 3 && (
                  <MessagePreviewsComponent messagesData={messagesData} />
                )}
              </div>
              <div className="flex connectPage_BottomRight"></div>
            </div>
          </div>
        </header>
      </div>
    ) : null
  );
}

export default ConnectPage;

const spinnerContainer = {
  marginTop: "20%",
};


