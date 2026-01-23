/* eslint-disable no-undef */
import "../assets/css/advancedmarker.css";
import "../assets/css/ConnectPage.css";
import React, { useState, useEffect, useMemo, useCallback } from "react";

import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { ConnectPagePlaceHolder } from "../components/ConnectPagePlaceHolder";
import { useNavigate, useParams } from "react-router-dom";

import {
  useGetMessagesByUserIdQuery,
  useLazyGetMessagesBetweenUsersQuery,
} from "../slices/MessageSlice";
import { MessagePreviewsComponent } from "../components/MessagePreviewsComponent";
import { SearchUserComponent } from "../components/SearchUserComponent";
import { ConversationComponent } from "../components/ConversationComponent";
import { MessageSenderComponent } from "../components/MessageSenderComponent";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { SearchUserResultsComponent } from "../components/SearchUserResultsComponent";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
const API_URL = process.env.REACT_APP_API_URL;

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

  const {
    data: messagePreviewsData,
    isLoading: isLoadingmessagePreviews,
    isError: isErrorMessages,
    error: errorMessages,
    isSuccess: isSuccessmessagePreviews,
    refetch: refetchMessagePreviews,
  } = useGetMessagesByUserIdQuery(currentUserId,
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


  useEffect(() => {
    console.log("isPageReady: ", isPageReady);
    console.log("isLoadingmessagePreviews: ", isLoadingmessagePreviews);
    console.log("isErrorMessages: ", isErrorMessages);
    console.log("isSuccessmessagePreviews: ", isSuccessmessagePreviews);
    console.log("messagePreviewsData: ", messagePreviewsData);
    console.log("conversationUserId: ", conversationUserId);
    console.log("conversationUserUsername: ", conversationUserUsername);
    console.log("currentUserId: ", currentUserId);
  }, [isPageReady, isLoadingmessagePreviews, isErrorMessages, isSuccessmessagePreviews]);


  //  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  /*
  const hubConnection = useMemo(() => {
    return new HubConnectionBuilder()
      .withUrl(`${API_URL}/chathub/11?userId=${currentUserId}`, {
        withCredentials: false, // TODO: is this correct?
      })
      .build();
  }, [currentUserId]);

  useEffect(() => {
    console.log("hubconnect: ", hubConnection);

    const startHubConnection = async () => {
      try {
        if (hubConnection.state === "Disconnected") {
          await hubConnection.start();
          console.log("SignalR connection started successfully.");
        }
      } catch (error) {
        console.error("Failed to start SignalR connection:", error.message);
      }
    };

    hubConnection.onclose(() => {
      console.log("SignalR connection closed.");
    });

    hubConnection.onreconnecting(() => {
      console.log("SignalR connection reconnecting...");
    });

    hubConnection.onreconnected(() => {
      console.log("SignalR connection reconnected.");
    });

    if (conversationUserId) {
      startHubConnection();
    }

    return () => {
      hubConnection.stop();
    };
  }, [hubConnection, conversationUserId]);

  const refreshMessages = React.useCallback(() => {
    if (users?.currentUserId && users?.conversationUserId) {
      triggerGetMessages({
        currentUserId: users.currentUserId,
        conversationUserId: users.conversationUserId,
      });
    }
  }, [users, triggerGetMessages]);

  useEffect(() => {
    const startHubConnection = async () => {
      try {
        await hubConnection.start();
        console.log("SignalR connection  started successfully.");
      } catch (error) {
        console.error("Failed to start SignalR connection:", error);
      }
    };
    startHubConnection();
    hubConnection.on(
      "ReceiveMessage",
      async (senderId, content, newTime, senderProfileUrl, senderUsername) => { }
    );

    hubConnection.on("ReceiveMessageRefetch", () => {
      refreshMessages();
    });

    return () => { };
  }, []);

  useEffect(() => {
    setUsers({ currentUserId, conversationUserId });
    // console.log("--->> conversationUserId: ", conversationUserId);
  }, [conversationUserId]);

  const stateOfTheHub = () => {
    console.log("state of the hub: ", hubConnection.state);
  };

  useEffect(() => {
    const { currentUserId, conversationUserId } = users;

    console.log("conversationUserId: ", conversationUserId);
    console.log("currentUserId: ", currentUserId);

    if (currentUserId && conversationUserId) {
      triggerGetMessages({ currentUserId, conversationUserId });
    }
  }, [users.currentUserId, users.conversationUserId]);

  useEffect(() => {
    if (conversationData) setMessagesToDisplay(conversationData.data);
  }, [conversationData]);

  useEffect(() => {
    if (conversationUserId) {
      refreshMessages();
    }
  }, [conversationUserId, refreshMessages]);

*/

  const refreshMessages = useCallback(() => {
    if (users?.currentUserId && users?.conversationUserId) {
      triggerGetMessages({
        currentUserId: users.currentUserId,
        conversationUserId: users.conversationUserId,
      });
    }
  }, [users, triggerGetMessages]);


  const hubConnection = useMemo(() => {
    console.log("--> Creating Hub Connection for userId:", currentUserId);
    return new HubConnectionBuilder()
      .withUrl(`${API_URL}/chathub/11?userId=${currentUserId}`, {
        withCredentials: false, // fine for cross-origin if your API allows
      })
      .withAutomaticReconnect() // optional but recommended
      .build();
  }, [currentUserId]);

  // Update users state whenever IDs change
  useEffect(() => {
    setUsers({ currentUserId, conversationUserId });
  }, [currentUserId, conversationUserId]);

  // Manage SignalR connection & listeners
  useEffect(() => {
    if (!conversationUserId) return;

    const startHubConnection = async () => {
      try {
        if (hubConnection.state === "Disconnected") {
          await hubConnection.start();
          console.log("SignalR connection started successfully.");
        }
      } catch (error) {
        console.error("Failed to start SignalR connection:", error.message);
      }
    };

    hubConnection.onclose(() => console.log("SignalR connection closed."));
    hubConnection.onreconnecting(() => console.log("SignalR reconnecting..."));
    hubConnection.onreconnected(() => console.log("SignalR reconnected."));
    hubConnection.on("ReceiveMessage", (senderId, content, newTime, senderProfileUrl, senderUsername) => {
    });

    hubConnection.on("ReceiveMessageRefetch", () => refreshMessages());

    startHubConnection();

    return () => {
      hubConnection.stop();
    };
  }, [hubConnection, conversationUserId, refreshMessages]);

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

  // Optional helper
  const stateOfTheHub = () => {
    console.log("Hub state:", hubConnection.state);
  };




  //  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  const handleSendMessage = async () => {
    setSendButtonDisabled(true);
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
    const milliseconds = String(currentDate.getMilliseconds()).padStart(3, "0");
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;

    const sentMessage = {
      dateTime: formattedDateTime,
      receiverId: conversationUserId,
      senderId: currentUserId,
      text: message,
    };

    // Optimistic UI Update
    setMessagesToDisplay((prevMessages) => {
      return [...(prevMessages ?? []), sentMessage];
    });

    setMessage("");

    try {
      if (hubConnection.state === "Disconnected") {
        await hubConnection.start();
      }
      await hubConnection.invoke(
        "SendMessage",
        currentUserId,
        conversationUserId,
        message
      );
      console.log("Message sent successfully.");
      refetchMessagePreviews();



    } catch (error) {
      console.error("Failed to send message:", error);
      setMessagesToDisplay((prevMessages) => {
        return prevMessages.filter(
          (msg) => msg.dateTime !== sentMessage.dateTime
        );
      });
      alert(
        "Failed to send message. Please check your connection and try again."
      );
    }

    setSendButtonDisabled(false);
  };

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
