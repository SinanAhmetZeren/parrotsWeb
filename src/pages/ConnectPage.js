/* eslint-disable no-undef */
import "../assets/css/advancedmarker.css";
import "../assets/css/ConnectPage.css";
import React, { useState, useEffect, useRef } from "react";

import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { useNavigate } from "react-router-dom";

import { useGetMessagesBetweenUsersQuery, useGetMessagesByUserIdQuery } from "../slices/MessageSlice";
import { MessagePreviewsComponent } from "../components/MessagePreviewsComponent";
import { SearchUserComponent } from "../components/SearchUserComponent";
import { ConversationComponent } from "../components/ConversationComponent";
import { MessageSenderComponent } from "../components/MessageSenderComponent";


function ConnectPage() {
  const currentUserId = "1bf7d55e-7be2-49fb-99aa-93d947711e32";
  const navigate = useNavigate();
  const handleGoToUser = (user) => {
    console.log("go to user: ", user.userName);
  }
  const [query, setQuery] = useState("");
  const [conversationUserId, setConversationUserId] = useState("")
  const [conversationUserUsername, setConversationUserUsername] = useState("")
  const [conversationUserProfileImg, setConversationUserProfileImg] = useState("")
  const [currentUserUsername, setCurrentUserUsername] = useState("")
  const [currentUserProfileImg, setCurrentUserProfileImg] = useState("")
  const [users, setUsers] = useState({ currentUserId, conversationUserId });

  useEffect(() => {
    setUsers({ currentUserId, conversationUserId })
    // console.log("--->> conversationUserId: ", conversationUserId);
  }, [conversationUserId])

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isError: isErrorMessages,
    error: errorMessages,
    isSuccess: isSuccessMessages,
    refetch,
  } = useGetMessagesByUserIdQuery(currentUserId);

  const {
    data: conversationData,
    isLoading: isLoadingConversation,
    isError: isErrorConversation,
    error,
    isSuccess: isSuccessConversation,
    refetch: refetchConversation,
  } = useGetMessagesBetweenUsersQuery(users);

  useEffect(() => {
    // console.log("conversationData: ", conversationData);
    // console.log("messagesData: ", messagesData);
  }, [conversationData, messagesData])


  useEffect(() => {
    if (conversationUserId) {
      refetchConversation();
    }
  }, [conversationUserId, refetchConversation]);

  return (
    isLoadingMessages ? (
      <div style={spinnerContainer}>
        <div className="spinner"></div>
      </div>
    ) : (
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
                {isSuccessMessages && query.length < 3 && (
                  <div style={MessagePreviewsContainer}>
                    <MessagePreviewsComponent
                      messagesData={messagesData}
                      userId={currentUserId}
                      setConversationUserId={setConversationUserId}
                      setConversationUserUsername={setConversationUserUsername}
                      setConversationUserProfileImg={setConversationUserProfileImg}
                      setCurrentUserUsername={setCurrentUserUsername}
                      setCurrentUserProfileImg={setCurrentUserProfileImg}
                    />
                  </div>
                )}
              </div>
              <div className="flex connectPage_BottomRight">
                <div style={ConversationComponentContainer}>
                  <ConversationComponent
                    conversationData={conversationData}
                    currentUserId={currentUserId}
                  // currentUserUsername={currentUserUsername}
                  // currentUserProfileImg={currentUserProfileImg}
                  // conversationUserId={conversationUserId}
                  // conversationUserProfileImg={conversationUserProfileImg}
                  // conversationUserUsername={conversationUserUsername}
                  />
                </div>

                {
                  conversationUserId && (
                    <div style={{ width: "100%" }}>
                      <MessageSenderComponent conversationUserId={conversationUserId} currentUserId={currentUserId} />
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </header>
      </div>
    )
  );
}

export default ConnectPage;

const spinnerContainer = {
  marginTop: "20%",
};

const MessagePreviewsContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  overflowY: "scroll",
}

const ConversationComponentContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  overflowY: "scroll",
  height: `calc(100vh - 5rem)`,
  alignSelf: "flex-start",
}