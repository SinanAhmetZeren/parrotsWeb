/* eslint-disable no-undef */
import "../assets/css/advancedmarker.css";
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
import { DirectMessageSenderComponent } from "../components/DirectMessageSenderComponent";
import { SearchUserResultsComponent } from "../components/SearchUserResultsComponent";
import { GroupConversationDetail } from "../components/GroupConversationDetail";
import { useCreateGroupMutation } from "../slices/GroupSlice";
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
  register_ReceiveGroupMessageRefetch,
  unregister_ReceiveGroupMessageRefetch,
  register_ReceiveGroupMessage,
  unregister_ReceiveGroupMessage,
} from "../signalr/signalRHub";
import { useDispatch, useSelector } from "react-redux";
import { setUnreadMessages, markMessagesRead, setPendingChatUserId, useGetBookmarksQuery } from "../slices/UserSlice";
import { useGetMyBidsQuery } from "../slices/VoyageSlice";
import { BidPillList } from "../components/BidPill";
import parrotsLogo from "../assets/images/placeholderparrots.webp";

// ── Tokens ─────────────────────────────────────────────────────────────────────
const blue = "#0A77EA";
const blueDk = "#0A5FBF";
const navy = "#0A2540";
const deep = "#081E36";
const mid = "#5C6B7A";
const line = "#E3E9F0";
const tint = "#F4F7FB";

function ConnectPage() {
  const { conversationUserPublicId: paramConversationUserId } = useParams();
  const { conversationUserUsername: paramConversationUserUsername } = useParams();
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
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [activeGroupData, setActiveGroupData] = useState(null);
  const [activeTab, setActiveTab] = useState("Chats");
  const [newGroupName, setNewGroupName] = useState("");
  const { data: myBids } = useGetMyBidsQuery(undefined, { skip: activeTab !== "Bids" });
  const [createGroup] = useCreateGroupMutation();

  useEffect(() => {
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
  } = useGetMessagePreviewsbyUserIdQuery(currentUserId, { refetchOnMountOrArgChange: true });

  const safeMessagePreviewsData = messagePreviewsData ?? [];
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    if (!isLoadingmessagePreviews && !isErrorMessages && isSuccessmessagePreviews) setIsPageReady(true);
    else setIsPageReady(false);
  }, [isLoadingmessagePreviews, isErrorMessages, isSuccessmessagePreviews]);

  const [triggerGetMessages, { data: conversationData, isLoading: isLoadingConversation, isError: isErrorConversation, error }] = useLazyGetMessagesBetweenUsersQuery();

  const pendingChatUserId = useSelector((state) => state.users.pendingChatUserId);

  useEffect(() => {
    if (pendingChatUserId && paramConversationUserId && paramConversationUserUsername) {
      setConversationUserId(pendingChatUserId);
      setConversationUserUsername(paramConversationUserUsername);
      dispatch(setPendingChatUserId(null));
    } else {
      setConversationUserId("");
      setConversationUserUsername("");
    }
  }, [paramConversationUserId, paramConversationUserUsername]);

  useEffect(() => {
    if (!currentUserId) return;
    if (isHubReady()) { invokeHub("EnterMessagesScreen", currentUserId); console.log("--> entered messages page"); }
    return () => { if (isHubReady()) { invokeHub("LeaveMessagesScreen", currentUserId); console.log("--> left messages page "); } };
  }, [currentUserId]);

  const refreshMessages = useCallback(() => {
    if (users?.currentUserId && users?.conversationUserId) {
      triggerGetMessages({ currentUserId: users.currentUserId, conversationUserId: users.conversationUserId });
      refetchMessagePreviews();
    }
  }, [users, triggerGetMessages, refetchMessagePreviews]);

  const handleCreateGroup = async (groupName) => {
    const result = await createGroup({ name: groupName, creatorId: currentUserId });
    if (result.data) {
      setActiveGroupData(result.data);
      setActiveGroupId(result.data.id);
      setConversationUserId("");
      setConversationUserUsername("");
      refetchMessagePreviews();
    }
  };

  const handleSetActiveGroupId = (groupId) => {
    setActiveGroupId(groupId);
    setActiveGroupData(null);
    if (groupId) { setConversationUserId(""); setConversationUserUsername(""); }
  };

  useEffect(() => { if (inputValue.length === 0) setQuery(""); }, [inputValue]);
  useEffect(() => { setUsers({ currentUserId, conversationUserId }); }, [currentUserId, conversationUserId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const now = Date.now();
    sendTimestampsRef.current = sendTimestampsRef.current.filter(t => now - t < 5000);
    if (sendTimestampsRef.current.length >= 5) return;
    sendTimestampsRef.current.push(now);
    setSendButtonDisabled(true);
    const sentMessage = { dateTime: new Date().toISOString(), receiverId: conversationUserId, senderId: currentUserId, text: message };
    setMessagesToDisplay((prev) => [...(prev ?? []), sentMessage]);
    const savedMessage = message;
    setMessage("");
    try {
      if (!isHubReady()) { setMessagesToDisplay(prev => prev.filter(m => m.dateTime !== sentMessage.dateTime)); setMessage(savedMessage); setSendButtonDisabled(false); toast.error("Not connected. Please wait and try again."); return; }
      await invokeHub("SendMessage", currentUserId, conversationUserId, message, false);
      refetchMessagePreviews();
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessagesToDisplay(prev => prev.filter(m => m.dateTime !== sentMessage.dateTime));
      toast.error("Failed to send message. Check connection and try again.");
    }
    setSendButtonDisabled(false);
  };

  useEffect(() => {
    if (!conversationUserId) return;
    const handleIncomingMessage = (data) => setMessagesToDisplay(prev => [...(prev ?? []), data]);
    const handleRefetch = () => refreshMessages();
    register_ReceiveMessage(handleIncomingMessage);
    register_ReceiveMessageRefetch(handleRefetch);
    return () => { unregister_ReceiveMessage(handleIncomingMessage); unregister_ReceiveMessageRefetch(handleRefetch); };
  }, [conversationUserId, refreshMessages]);

  useEffect(() => {
    const handler = () => refetchMessagePreviews();
    register_ReceiveMessageRefetch(handler);
    register_ReceiveGroupMessageRefetch(handler);
    register_ReceiveGroupMessage(handler);
    return () => { unregister_ReceiveMessageRefetch(handler); unregister_ReceiveGroupMessageRefetch(handler); unregister_ReceiveGroupMessage(handler); };
  }, [refetchMessagePreviews]);

  useEffect(() => {
    const { currentUserId, conversationUserId } = users;
    if (currentUserId && conversationUserId) { triggerGetMessages({ currentUserId, conversationUserId }); refetchMessagePreviews(); }
  }, [users, triggerGetMessages, refetchMessagePreviews]);

  useEffect(() => { if (conversationData) setMessagesToDisplay(conversationData.data); }, [conversationData]);

  useEffect(() => {
    if (!messagePreviewsData) return;
    const hasUnread = messagePreviewsData.some(m => m.unreadCount > 0);
    if (hasUnread) dispatch(setUnreadMessages(true)); else dispatch(markMessagesRead());
  }, [messagePreviewsData, dispatch]);

  useEffect(() => { if (conversationUserId) refreshMessages(); }, [conversationUserId, refreshMessages]);

  useEffect(() => {
    const handleVisibilityChange = () => { if (document.visibilityState === "visible") { console.log("--> Tab focused: refreshing messages...", new Date().toLocaleTimeString()); refreshMessages(); } };
    const handleWindowFocus = () => { console.log("--> Window focused: refreshing messages...", new Date().toLocaleTimeString()); refreshMessages(); };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);
    return () => { document.removeEventListener("visibilitychange", handleVisibilityChange); window.removeEventListener("focus", handleWindowFocus); };
  }, [refreshMessages]);

  const { isError: isHealthCheckError } = useHealthCheckQuery();
  if (isHealthCheckError) { console.log(".....Health check failed....."); return <SomethingWentWrong />; }
  if (isErrorMessages || isErrorConversation || errorMessages || error) return <SomethingWentWrong />;

  if (isLoadingmessagePreviews || messagePreviewsData === undefined) return <ConnectPagePlaceHolder />;

  return (
    <div className="App">
      <header className="App-header">
        <div style={pageWrap}>
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight"><TopBarMenu /></div>
          </div>

          {hubState !== "connected" && (
            <div style={{ backgroundColor: hubState === "reconnecting" ? "#78350f" : "#7f1d1d", color: hubState === "reconnecting" ? "#fcd34d" : "#fca5a5", fontSize: "0.75rem", padding: "4px 12px", textAlign: "center" }}>
              {hubState === "reconnecting" ? "⚠ Reconnecting to chat..." : "✕ Disconnected from chat — messages may not send"}
            </div>
          )}

          {/* ── Main body ── */}
          <div style={bodyGrid}>

            {/* ── Left panel ── */}
            <div style={sidePanel}>
              {/* Tabs + create row */}
              <div style={sideTop}>
                <div style={seg}>
                  {["Chats", "Find", "Bookmarks", "Bids"].map(tab => (
                    <button key={tab} style={{ ...segBtn, ...(activeTab === tab ? segBtnOn : {}) }} onClick={() => { setActiveTab(tab); if (tab === "Bookmarks") setShowSaved(true); else setShowSaved(false); if (tab === "Chats") { setQuery(""); setInputValue(""); } }}>{tab}</button>
                  ))}
                </div>
                {activeTab === "Chats" && (
                  <div style={mkRow}>
                    <input
                      type="text"
                      value={newGroupName}
                      onChange={e => setNewGroupName(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && newGroupName.trim()) { handleCreateGroup(newGroupName); setNewGroupName(""); } }}
                      style={mkInput}
                      placeholder="Group name…"
                    />
                    <button
                      style={{ ...mkBtn, ...(newGroupName.trim() ? mkBtnOn : {}) }}
                      disabled={!newGroupName.trim()}
                      onClick={() => { if (newGroupName.trim()) { handleCreateGroup(newGroupName); setNewGroupName(""); } }}
                    >Create</button>
                  </div>
                )}
                {activeTab === "Find" && (
                  <div style={mkRow}>
                    <SearchUserComponent
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      onSearch={() => { setShowSaved(false); setQuery(inputValue); }}
                      isLoading={isSearchLoading}
                      isDarkMode={isDarkMode}
                      showSaved={showSaved}
                    />
                  </div>
                )}
              </div>

              {/* Thread list */}
              <div style={threads} className={dark ? "dark-scrollbar" : "cream-scrollbar"}>
                {activeTab === "Bids" ? (
                  <BidPillList bids={myBids} isDarkMode={isDarkMode} />
                ) : showSaved ? (
                  <SearchUserResultsComponent
                    query=""
                    setQuery={() => {}}
                    userId={currentUserId}
                    setConversationUserId={id => { setConversationUserId(id); setShowSaved(false); setActiveGroupId(null); setActiveGroupData(null); }}
                    setConversationUserUsername={setConversationUserUsername}
                    handleGoToUser={handleGoToUser}
                    setInputValue={setInputValue}
                    isDarkMode={isDarkMode}
                    staticUsers={bookmarksData}
                  />
                ) : query.length > 2 ? (
                  <SearchUserResultsComponent
                    query={query}
                    setQuery={setQuery}
                    userId={currentUserId}
                    setConversationUserId={id => { setConversationUserId(id); setActiveGroupId(null); setActiveGroupData(null); }}
                    setConversationUserUsername={setConversationUserUsername}
                    handleGoToUser={handleGoToUser}
                    setInputValue={setInputValue}
                    onLoadingChange={setIsSearchLoading}
                    isDarkMode={isDarkMode}
                  />
                ) : isSuccessmessagePreviews && activeTab === "Chats" ? (
                  <MessagePreviewsComponent
                    messagesData={safeMessagePreviewsData}
                    userId={currentUserId}
                    selectedUserId={conversationUserId}
                    setConversationUserId={setConversationUserId}
                    setConversationUserUsername={setConversationUserUsername}
                    setActiveGroupId={handleSetActiveGroupId}
                    handleGoToUser={handleGoToUser}
                    isDarkMode={isDarkMode}
                  />
                ) : null}
              </div>
            </div>

            {/* ── Right panel ── */}
            <div style={convPanel}>
              {activeGroupId ? (
                <GroupConversationDetail
                  groupId={activeGroupId}
                  currentUserId={currentUserId}
                  isDarkMode={isDarkMode}
                  refetchPreviews={refetchMessagePreviews}
                />
              ) : (
                <>
                  {conversationUserId && (
                    <div style={convHeader}>
                      <div style={convHeaderAv}>
                        {(() => {
                          const preview = safeMessagePreviewsData.find(m =>
                            (m.receiverId === currentUserId ? m.senderId : m.receiverId) === conversationUserId
                          );
                          const img = preview
                            ? (preview.receiverId === currentUserId ? preview.senderProfileThumbnailUrl || preview.senderProfileUrl : preview.receiverProfileThumbnailUrl || preview.receiverProfileUrl)
                            : null;
                          return img ? <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : null;
                        })()}
                      </div>
                      <div>
                        <div style={convHeaderName}>{conversationUserUsername}</div>
                        <div style={convHeaderSub}>Direct message</div>
                      </div>
                      <span style={{ flex: 1 }} />
                      <button style={convHeaderIco} title="Open profile" onClick={() => {
                        const preview = safeMessagePreviewsData.find(m =>
                          (m.receiverId === currentUserId ? m.senderId : m.receiverId) === conversationUserId
                        );
                        if (preview) {
                          const publicId = preview.receiverId === currentUserId ? preview.senderPublicId : preview.receiverPublicId;
                          handleGoToUser(conversationUserId, conversationUserUsername, publicId);
                        }
                      }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 19a6 6 0 0 1 11 0"/></svg>
                      </button>
                    </div>
                  )}
                  {!conversationUserId && (
                    <div style={placeholderWrap}>
                      <div style={placeholderCircle}>
                        <img src={parrotsLogo} alt="logo" style={{ width: "19rem", height: "19rem" }} />
                      </div>
                    </div>
                  )}
                  <div style={msgsWrap} className={dark ? "dark-scrollbar" : "cream-scrollbar"}>
                    <ConversationComponent
                      conversationData={conversationData}
                      messagesToDisplay={messagesToDisplay}
                      currentUserId={currentUserId}
                      conversationUserId={conversationUserId}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                  <DirectMessageSenderComponent
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
                </>
              )}
            </div>

          </div>
        </div>
      </header>
    </div>
  );
}

export default ConnectPage;

// ── Styles ─────────────────────────────────────────────────────────────────────

const pageWrap = {
  display: "flex", flexDirection: "column",
  width: "100%", minHeight: "100vh",
  fontFamily: "Nunito, sans-serif",
  backgroundColor: deep,
};

const bodyGrid = {
  maxWidth: 1240,
  width: "100%",
  margin: "0 auto",
  padding: "0 14px 14px",
  display: "grid",
  gridTemplateColumns: "342px minmax(0,1fr)",
  gap: 14,
  height: 660,
};

const panelBase = {
  backgroundColor: "#fff",
  borderRadius: 14,
  boxShadow: "0 8px 24px rgba(0,14,30,.18)",
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  overflow: "hidden",
};

const sidePanel = { ...panelBase };

const sideTop = {
  padding: "14px 14px 12px",
  display: "flex", flexDirection: "column", gap: 11,
  flexShrink: 0,
  borderBottom: `1px solid ${line}`,
};

const seg = {
  display: "flex", gap: 4,
  backgroundColor: tint, padding: 4, borderRadius: 99,
};

const segBtn = {
  flex: 1,
  fontFamily: "Nunito, sans-serif",
  border: "none", background: "none", cursor: "pointer",
  fontSize: 12.5, fontWeight: 800, color: mid,
  padding: "7px 0", borderRadius: 99, whiteSpace: "nowrap",
};

const segBtnOn = { backgroundColor: blue, color: "#fff" };

const mkRow = {
  display: "flex", alignItems: "center", gap: 8,
};

const mkInput = {
  flex: 1, minWidth: 0,
  fontFamily: "Nunito, sans-serif",
  fontSize: 13.5, fontWeight: 700, color: navy,
  backgroundColor: tint,
  border: "1.5px solid transparent",
  borderRadius: 8,
  padding: "9px 11px",
  outline: "none",
};

const mkBtn = {
  fontFamily: "Nunito, sans-serif",
  border: `1.5px solid ${line}`,
  backgroundColor: "#fff",
  color: mid,
  fontSize: 13.5, fontWeight: 800,
  padding: "9px 17px",
  borderRadius: 99,
  cursor: "not-allowed",
  flexShrink: 0,
};

const mkBtnOn = {
  backgroundColor: blue,
  borderColor: blue,
  color: "#fff",
  cursor: "pointer",
};

const threads = {
  flex: 1, minHeight: 0,
  overflowY: "auto",
  padding: "11px 12px 14px",
  display: "flex", flexDirection: "column", gap: 7,
};

const convPanel = { ...panelBase };

const msgsWrap = {
  display: "flex", flexDirection: "column",
  width: "100%",
  overflowY: "scroll",
  flex: 1, minHeight: 0,
};

const convHeader = {
  display: "flex", alignItems: "center", gap: 11,
  padding: "13px 18px",
  borderBottom: `1px solid ${line}`,
  backgroundColor: "#FAFCFE",
  flexShrink: 0,
};

const convHeaderAv = {
  width: 34, height: 34, borderRadius: "50%",
  overflow: "hidden", flexShrink: 0,
  display: "flex", alignItems: "center", justifyContent: "center",
  backgroundColor: tint,
};

const convHeaderName = {
  fontSize: 15.5, fontWeight: 800, color: navy, fontFamily: "Nunito, sans-serif",
};

const convHeaderSub = {
  fontSize: 11, fontWeight: 800, letterSpacing: "0.1em",
  textTransform: "uppercase", color: mid,
  marginTop: 1, fontFamily: "Nunito, sans-serif",
};

const convHeaderIco = {
  width: 30, height: 30, borderRadius: 8,
  border: `1px solid ${line}`, background: "#fff",
  color: mid, display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", flexShrink: 0,
  fontFamily: "Nunito, sans-serif",
};

const placeholderWrap = {
  width: "100%", flex: 1,
  display: "flex", alignItems: "center", justifyContent: "center",
};

const placeholderCircle = {
  borderRadius: "50%",
  height: "22rem", width: "22rem",
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: "1.5rem",
  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
};
