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
import { useHealthCheckQuery } from "../slices/HealthSlice";

import {
  isHubReady,
  invokeHub,
  register_ReceiveMessage,
  unregister_ReceiveMessage,
  register_ReceiveMessageRefetch,
  unregister_ReceiveMessageRefetch,
} from "../signalr/signalRHub"; // your centralized hub module
import { useDispatch } from "react-redux";
import { setUnreadMessages } from "../slices/UserSlice";


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
  const [query, setQuery] = useState("");
  const [conversationUserId, setConversationUserId] = useState("");
  const [conversationUserUsername, setConversationUserUsername] = useState("");
  const [users, setUsers] = useState({ currentUserId, conversationUserId });
  const [message, setMessage] = useState("");
  const [messagesToDisplay, setMessagesToDisplay] = useState([]);
  const [sendButtonDisabled, setSendButtonDisabled] = useState(false);
  const dispatch = useDispatch();
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

  // Update users state whenever IDs change
  useEffect(() => {
    setUsers({ currentUserId, conversationUserId });
  }, [currentUserId, conversationUserId]);

  //  send message + optimistic UI update + refetch previews. 
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setSendButtonDisabled(true);
    const now = new Date();
    const formattedDateTime = now.toISOString();
    const sentMessage = {
      dateTime: formattedDateTime,
      receiverId: conversationUserId,
      senderId: currentUserId,
      text: message,
    };
    // Optimistic UI Update
    setMessagesToDisplay((prev) => [...(prev ?? []), sentMessage]);
    setMessage("");

    try {
      if (!isHubReady()) {
        console.warn("Hub not ready. Message may fail to send.");
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
      alert("Failed to send message. Check connection and try again.");
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
              {/* <button onClick={() => stateOfTheHub()}>show state of the hub</button> */}

              <div className="flex connectPage_Bottom">
                <div className="flex connectPage_BottomLeft">
                  <div style={SearchBarContainer}>
                    <SearchUserComponent query={query} setQuery={setQuery} />
                  </div>
                  {query.length > 2 && (
                    <div style={MessagePreviewsContainer}>
                      <SearchUserResultsComponent
                        query={query}
                        setQuery={setQuery}
                        userId={currentUserId}
                        setConversationUserId={setConversationUserId}
                        setConversationUserUsername={setConversationUserUsername}
                        handleGoToUser={handleGoToUser}
                      />
                    </div>
                  )}
                  {isSuccessmessagePreviews && query.length < 3 && (
                    <div style={MessagePreviewsContainer}>
                      <MessagePreviewsComponent
                        messagesData={safeMessagePreviewsData}
                        userId={currentUserId}
                        selectedUserId={conversationUserId}
                        setConversationUserId={setConversationUserId}
                        setConversationUserUsername={setConversationUserUsername}
                        handleGoToUser={handleGoToUser}
                      />
                    </div>
                  )}
                </div>
                <div className="flex connectPage_BottomRight">
                  <div style={ConversationComponentContainer}>
                    <ConversationComponent
                      conversationData={conversationData}
                      messagesToDisplay={messagesToDisplay}
                      currentUserId={currentUserId}
                      conversationUserId={conversationUserId}
                    />
                  </div>

                  {conversationUserId && (
                    <div style={{ width: "100%" }}>
                      <MessageSenderComponent
                        conversationUserId={conversationUserId}
                        conversationUserUsername={conversationUserUsername}
                        currentUserId={currentUserId}
                        message={message}
                        setMessage={setMessage}
                        handleSendMessage={handleSendMessage}
                        sendButtonDisabled={sendButtonDisabled}
                      />
                    </div>
                  )}
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
  backgroundColor: "rgb(240, 240, 240)",
  height: "9vh",
};
