/* eslint-disable no-undef */
import "../assets/css/advancedmarker.css";
import "../assets/css/ConnectPage.css";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";

import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { ConnectPagePlaceHolder } from "../components/ConnectPagePlaceHolder";
import { useNavigate, useParams } from "react-router-dom";

import {
  useGetMessagePreviewsbyUserIdQuery,
  useLazyGetMessagesBetweenUsersQuery,
} from "../slices/MessageSlice";
import { MessagePreviewsComponent } from "../components/MessagePreviewsComponent";
import { SearchUserComponent } from "../components/SearchUserComponent";
import { ConversationComponent } from "../components/ConversationComponent";
import { MessageSenderComponent } from "../components/MessageSenderComponent";
import { SearchUserResultsComponent } from "../components/SearchUserResultsComponent";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { toast } from "react-toastify";
import { useHealthCheckQuery } from "../slices/HealthSlice";

import {
  isHubReady,
  invokeHub,
  getHubState,
  register_ReceiveMessage,
  unregister_ReceiveMessage,
  register_ReceiveMessageRefetch,
  unregister_ReceiveMessageRefetch,
} from "../signalr/signalRHub"; // your centralized hub module
import { useDispatch, useSelector } from "react-redux";
import { setUnreadMessages, useGetBookmarksQuery } from "../slices/UserSlice";
import parrotsLogo from "../assets/images/ParrotsLogo.png";
import { parrotTextDarkBlue } from "../styles/colors";


//const API_URL = process.env.REACT_APP_API_URL;

function ConnectPage() {
  const { conversationUserId: paramConversationUserId } = useParams();
  const { conversationUserUsername: paramConversationUserUsername } =
    useParams();
  const currentUserId = localStorage.getItem("storedUserId");
  const navigate = useNavigate();
  const handleGoToUser = (userId, userName, userPublicId) => {
    navigate(`/profile-public/${userPublicId}/${userName}`);
  };
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [conversationUserId, setConversationUserId] = useState("");
  const [conversationUserUsername, setConversationUserUsername] = useState("");
  const [users, setUsers] = useState({ currentUserId, conversationUserId });
  const [message, setMessage] = useState("");
  const [messagesToDisplay, setMessagesToDisplay] = useState([]);
  const [sendButtonDisabled, setSendButtonDisabled] = useState(false);
  const sendTimestampsRef = useRef([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [hubState, setHubState] = useState("connected");

  useEffect(() => {
    // Delay before showing disconnect state to avoid false banner on initial load
    const delay = setTimeout(() => setHubState(getHubState()), 4000);
    const interval = setInterval(() => setHubState(getHubState()), 2000);
    return () => { clearTimeout(delay); clearInterval(interval); };
  }, []);
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.users.isDarkMode);
  const dark = isDarkMode;
  const { data: bookmarksRaw } = useGetBookmarksQuery(undefined, { skip: !showSaved });
  const bookmarksData = React.useMemo(() => bookmarksRaw?.map(b => ({
    id: b.bookmarkedUserId,
    userId: b.bookmarkedUserId,
    userName: b.userName,
    profileImageUrl: b.profileImageUrl,
    profileImageThumbnailUrl: b.profileImageThumbnailUrl,
    publicId: b.publicId,
  })) ?? [], [bookmarksRaw]);
  const {
    data: messagePreviewsData,
    isLoading: isLoadingmessagePreviews,
    isError: isErrorMessages,
    error: errorMessages,
    isSuccess: isSuccessmessagePreviews,
    refetch: refetchMessagePreviews,
  } = useGetMessagePreviewsbyUserIdQuery(currentUserId,
    { refetchOnMountOrArgChange: true }
  );

  const safeMessagePreviewsData = messagePreviewsData ?? [];
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    if (
      !isLoadingmessagePreviews &&
      !isErrorMessages &&
      isSuccessmessagePreviews
    ) {
      setIsPageReady(true);
    } else {
      setIsPageReady(false);
    }
  }, [isLoadingmessagePreviews, isErrorMessages, isSuccessmessagePreviews]);

  const [
    triggerGetMessages,
    {
      data: conversationData,
      isLoading: isLoadingConversation,
      isError: isErrorConversation,
      error,
      isSuccess: isSuccessConversation,
    },
  ] = useLazyGetMessagesBetweenUsersQuery();

  useEffect(() => {
    if (paramConversationUserId && paramConversationUserUsername) {
      setConversationUserId(paramConversationUserId);
      setConversationUserUsername(paramConversationUserUsername);
    } else {
      setConversationUserId("");
      setConversationUserUsername("");
    }
  }, [paramConversationUserId, paramConversationUserUsername]);


  // SignalR: EnterMessagesScreen and LeaveMessagesScreen on page load/unload
  useEffect(() => {
    if (!currentUserId) return;
    // Enter 
    if (isHubReady()) {
      invokeHub("EnterMessagesScreen", currentUserId);
      dispatch(setUnreadMessages(false)); // Mark messages as read in global state
      console.log("--> entered messages page");
    }
    // Cleanup function: leave 
    return () => {
      if (isHubReady()) {
        invokeHub("LeaveMessagesScreen", currentUserId);
        console.log("--> left messages page ");
      }
    };
  }, [currentUserId]);

  // refetch messages and message previews. 
  const refreshMessages = useCallback(() => {
    if (users?.currentUserId && users?.conversationUserId) {

      triggerGetMessages({
        currentUserId: users.currentUserId,
        conversationUserId: users.conversationUserId,
      });
      refetchMessagePreviews();
    }
  }, [users, triggerGetMessages, refetchMessagePreviews]);

  // Reset query when input is cleared
  useEffect(() => {
    if (inputValue.length === 0) setQuery("");
  }, [inputValue]);

  // Update users state whenever IDs change
  useEffect(() => {
    setUsers({ currentUserId, conversationUserId });
  }, [currentUserId, conversationUserId]);

  //  send message + optimistic UI update + refetch previews. 
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Frontend rate limit: block if 5 messages sent within 5 seconds
    const now = Date.now();
    sendTimestampsRef.current = sendTimestampsRef.current.filter(t => now - t < 5000);
    if (sendTimestampsRef.current.length >= 5) return;
    sendTimestampsRef.current.push(now);

    setSendButtonDisabled(true);
    const formattedDateTime = new Date().toISOString();
    const sentMessage = {
      dateTime: formattedDateTime,
      receiverId: conversationUserId,
      senderId: currentUserId,
      text: message,
    };
    // Optimistic UI Update
    setMessagesToDisplay((prev) => [...(prev ?? []), sentMessage]);
    const savedMessage = message;
    setMessage("");

    try {
      if (!isHubReady()) {
        setMessagesToDisplay((prev) =>
          prev.filter((msg) => msg.dateTime !== sentMessage.dateTime)
        );
        setMessage(savedMessage);
        setSendButtonDisabled(false);
        toast.error("Not connected. Please wait and try again.");
        return;
      }

      // Send message via centralized invoke
      await invokeHub("SendMessage", currentUserId, conversationUserId, message);

      // Optionally refresh previews or other UI
      refetchMessagePreviews();
    } catch (err) {
      console.error("Failed to send message:", err);

      // Rollback optimistic UI
      setMessagesToDisplay((prev) =>
        prev.filter((msg) => msg.dateTime !== sentMessage.dateTime)
      );
      toast.error("Failed to send message. Check connection and try again.");
    }

    setSendButtonDisabled(false);
  };

  // register_ReceiveMessage & register_ReceiveMessageRefetch  
  // -> will refetch messages and previews. 
  // -> will setMessagesToDisplay 
  useEffect(() => {
    if (!conversationUserId) return;
    const handleIncomingMessage = (data) => {
      setMessagesToDisplay((prev) => [...(prev ?? []), data]);
    };
    const handleRefetch = () => refreshMessages();
    register_ReceiveMessage(handleIncomingMessage);
    register_ReceiveMessageRefetch(handleRefetch);
    return () => {
      unregister_ReceiveMessage(handleIncomingMessage);
      unregister_ReceiveMessageRefetch(handleRefetch);
    };
  }, [conversationUserId, refreshMessages]);


  // Refresh messages when users IDs change
  useEffect(() => {
    const { currentUserId, conversationUserId } = users;
    if (currentUserId && conversationUserId) {
      triggerGetMessages({ currentUserId, conversationUserId });
    }
  }, [users, triggerGetMessages]);

  // Update messages to display when new conversation data arrives
  useEffect(() => {
    if (conversationData) {
      setMessagesToDisplay(conversationData.data);
    }
  }, [conversationData]);

  // Refresh messages if conversationUserId changes
  useEffect(() => {
    if (conversationUserId) {
      refreshMessages();
    }
  }, [conversationUserId, refreshMessages]);


  // Refresh messages and previews when tab/window regains focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("--> Tab focused: refreshing messages...", new Date().toLocaleTimeString());
        refreshMessages();
      }
    };
    const handleWindowFocus = () => {
      console.log("--> Window focused: refreshing messages...", new Date().toLocaleTimeString());
      refreshMessages();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [refreshMessages]);


  const { data: healthCheckData, isError: isHealthCheckError } =
    useHealthCheckQuery();

  if (isHealthCheckError) {
    console.log(".....Health check failed.....");
    return <SomethingWentWrong />;
  }

  if (isErrorMessages || isErrorConversation || errorMessages || error) {
    return <SomethingWentWrong />;
  }

  return (
    // true ||
    // isLoadingmessagePreviews || !messagePreviewsData ? 
    isLoadingmessagePreviews || messagePreviewsData === undefined
      //|| messagePreviewsData === null 
      ?
      (
        <ConnectPagePlaceHolder />
      ) : (
        <div className="App">
          <header className="App-header">
            <div className="flex mainpage_Container">
              <div className="flex mainpage_TopRow">
                <TopLeftComponent />
                <div className="flex mainpage_TopRight">
                  <TopBarMenu />
                </div>
              </div>
              {hubState !== "connected" && (
                <div style={{
                  backgroundColor: hubState === "reconnecting" ? "#78350f" : "#7f1d1d",
                  color: hubState === "reconnecting" ? "#fcd34d" : "#fca5a5",
                  fontSize: "0.75rem",
                  padding: "4px 12px",
                  textAlign: "center",
                }}>
                  {hubState === "reconnecting" ? "⚠ Reconnecting to chat..." : "✕ Disconnected from chat — messages may not send"}
                </div>
              )}

              <div className="flex connectPage_Bottom">
                <div className="flex connectPage_BottomLeft" style={dark ? { backgroundColor: "#011a32" } : {}}>
                  <div style={dark ? { ...SearchBarContainer, backgroundColor: "#011a32" } : SearchBarContainer}>
                    <SearchUserComponent
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      onSearch={() => { setShowSaved(false); setQuery(inputValue); }}
                      isLoading={isSearchLoading}
                      isDarkMode={isDarkMode}
                      showSaved={showSaved}
                      onToggleSaved={() => { setShowSaved(s => !s); setQuery(""); setInputValue(""); }}
                    />
                  </div>
                  {showSaved ? (
                    <div style={MessagePreviewsContainer} className="hide-scrollbar">
                      <SearchUserResultsComponent
                        query=""
                        setQuery={() => {}}
                        userId={currentUserId}
                        setConversationUserId={(id) => { setConversationUserId(id); setShowSaved(false); }}
                        setConversationUserUsername={setConversationUserUsername}
                        handleGoToUser={handleGoToUser}
                        setInputValue={setInputValue}
                        isDarkMode={isDarkMode}
                        staticUsers={bookmarksData}
                      />
                    </div>
                  ) : query.length > 2 ? (
                    <div style={MessagePreviewsContainer} className="hide-scrollbar">
                      <SearchUserResultsComponent
                        query={query}
                        setQuery={setQuery}
                        userId={currentUserId}
                        setConversationUserId={setConversationUserId}
                        setConversationUserUsername={setConversationUserUsername}
                        handleGoToUser={handleGoToUser}
                        setInputValue={setInputValue}
                        onLoadingChange={setIsSearchLoading}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                  ) : isSuccessmessagePreviews && (
                    <div style={MessagePreviewsContainer} className="hide-scrollbar">
                      <MessagePreviewsComponent
                        messagesData={safeMessagePreviewsData}
                        userId={currentUserId}
                        selectedUserId={conversationUserId}
                        setConversationUserId={setConversationUserId}
                        setConversationUserUsername={setConversationUserUsername}
                        handleGoToUser={handleGoToUser}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                  )}
                </div>
                <div className="flex connectPage_BottomRight" style={dark ? { backgroundColor: "#011a32" } : {}}>
                  <div style={dark ? { ...ConversationComponentContainer, backgroundColor: "#011a32" } : ConversationComponentContainer} className={dark ? "dark-scrollbar" : "cream-scrollbar"}>

                    {!conversationUserId &&
                      <div style={imageWrapperWrapper}>
                        <div style={imageWrapper}>

                          <img
                            src={parrotsLogo}
                            alt="logo"
                            style={image}
                          />
                        </div>
                      </div>
                    }

                    <ConversationComponent
                      conversationData={conversationData}
                      messagesToDisplay={messagesToDisplay}
                      currentUserId={currentUserId}
                      conversationUserId={conversationUserId}
                      isDarkMode={isDarkMode}
                    />
                  </div>

                  <div style={{ width: "100%" }}>
                    <MessageSenderComponent
                      conversationUserId={conversationUserId}
                      conversationUserUsername={conversationUserUsername}
                      currentUserId={currentUserId}
                      message={message}
                      setMessage={setMessage}
                      handleSendMessage={handleSendMessage}
                      sendButtonDisabled={!conversationUserId || sendButtonDisabled}
                      isDarkMode={isDarkMode}
                      placeholder={conversationUserId ? `Write a message to ${conversationUserUsername}` : ""}
                      hideSendLabel={!conversationUserId}
                    />
                  </div>
                </div>
              </div>
            </div>
          </header>
        </div>
      )
  );
}

export default ConnectPage;

const MessagePreviewsContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  overflowY: "scroll",
};

const ConversationComponentContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  overflowY: "scroll",
  height: `calc(100vh - 10rem)`,
  alignSelf: "flex-start",
};

const SearchBarContainer = {
  backgroundColor: "#f9f5f1",
  height: "9vh",
};

const imageWrapper = {
  width: "100%",
  height: "100%",
  alignSelf: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

const imageWrapperWrapper = {
  width: "100%",
  height: "100%",
}

const image = {
  width: "20rem",
  height: "20rem",
  margin: "auto",
  alignSelf: "center",
  margintop: "15rem",
  borderRadius: "11rem",
}

const subText = {
  fontSize: "24px",
  color: parrotTextDarkBlue,
  marginBottom: "20px",
}