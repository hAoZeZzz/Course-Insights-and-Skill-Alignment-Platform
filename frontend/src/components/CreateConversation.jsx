import React, { useState, useEffect } from "react";
import Input from "@mui/material/Input";
import cross from "../assets/cross-1.svg";
import search_PIC from "../assets/search-pic.svg";
import startTalk from "../assets/start-talk.svg";
import { API_ENDPOINT } from "../constants";
import avatar from "../assets/default_avatar.svg";

const ariaLabel = { "aria-label": "description" };

const CreateConversation = ({
  isSearchVisible,
  setIsSearchVisible,
  isExpanded,
  setIsExpanded,
  isChatVisible,
  setIsChatVisible,
  currentChatRoomID,
  setCurrentChatRoomID,
  onData,
  receiverInfo,
  setReceiverInfo,
  messages,
  setMessages,
  messagesRef,
  conversations,
  receiver_id,
  setReceiver_id,
}) => {
  const token = localStorage.getItem("token");
  const [searchUser, setSearchUser] = useState([]);
  const [createConversationSearch, setCreateConversationSearch] = useState("");
  const handleClickCross = () => {
    setIsSearchVisible(!isSearchVisible);
    setCreateConversationSearch("");
    setSearchUser([]);
  };

  useEffect(() => {
    setSearchUser([]);
  }, []);
  const handleInputSearch = (e) => {
    setCreateConversationSearch(e.target.value);
  };

  const handleSearchButtonClick = () => {
    if (createConversationSearch === "") {
      alert("Please input keywords to search!");
    } else {
      getUser();
    }
  };
//   if user start to communicate with other this function will be called.
  const handleClickStartTalkButton = async (e) => {
    setIsSearchVisible(false);
    setSearchUser([]);
    // console.log(isChatVisible);
    const clickedElement = e.target;
    const elementId = clickedElement.id;
    const parts = elementId.split("-");
    const name = parts[0];
    const email = parts[1];
    const id = parts[2];
    setReceiver_id(id);
    setReceiverInfo([name, email]);
    setCurrentChatRoomID(elementId);
    setIsExpanded(true);
    setIsChatVisible(true);
    await getCurrentMessages(id).then(() => {
      console.log(" ");
    });
  };

//   This function is to get the user name and email who has be talk with.
  const getUser = async () => {
    try {
      const res = await fetch(
        `${API_ENDPOINT}/search_users?keyword=${createConversationSearch}`,
        {
          methods: "GET",
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        if (data.data) {
          const formattedData = data.data.map((user) => ({
            id: user.id,
            avatar: user.avatar,
            name: user.user_name,
            email: user.email,
          }));
          if (formattedData.length === 0) {
            alert("No user in database");
          } else {
            setSearchUser(formattedData);
          }
        }

      }
    } catch (error) {
      alert("Failed to fetch: " + error.message);
    }
  };

// This function is used to get the messages with one user
  const getCurrentMessages = async (elementId) => {
    try {
      const res = await fetch(`${API_ENDPOINT}/received?other=${elementId}`, {
        methods: "GET",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        // console.log(data.data);
        // console.log(messages);
        if (data.data) {
          if (
            JSON.stringify(data.data) !== JSON.stringify(messagesRef.current)
          ) {
            // console.log(123);
            setMessages(data.data);
          }
        }
      }
    } catch (error) {
      alert("Failed to fetch: " + error.message);
    }
  };

  return (
    <>
      {isSearchVisible && <div className="create-conversation-backdrop"></div>}
      {isSearchVisible && (
        <div className="create-conversation-box">
          <div className="create-conversation-title">
            Create Conversation
            <img
              src={cross}
              alt=""
              style={{ height: "20px", position: "absolute", right: "0px" }}
              onClick={handleClickCross}
            />
          </div>

          <div className="create-conversation-search-box">
            <div style={{ width: "90%" }}>
              <Input
                placeholder="Input email or user name"
                inputProps={ariaLabel}
                style={{ width: "100%" }}
                onChange={handleInputSearch}
              />
            </div>
            <img src={search_PIC} alt="" onClick={handleSearchButtonClick} />
          </div>
          <div className="create-conversation-search-result">
            {searchUser.map((user, index) => (
              <div
                key={index}
                className="create-conversation-search-result-user"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                  borderBottom: "1px solid #ccc",
                  maxWidth: "100%",
                }}
                id={`${user["name"]}-${user["email"]}`}
              >
                <div
                  className="create-conversation-search-result-user-left"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img
                    src={user.avatar ? user.avatar : avatar}
                    alt=""
                    className="create-conversation-search-result-user-avatar"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  <div
                    className="create-conversation-search-result-user-right"
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      style={{
                        fontSize: "20px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "#222",
                        height: "25px",
                      }}
                    >
                      {user["name"]}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "#555",
                      }}
                    >
                      {user["email"]}
                    </div>
                  </div>
                </div>
                <button className="create-conversation-search-result-user-button">
                  <img
                    id={`${user["name"]}-${user["email"]}-${user["id"]}`}
                    src={startTalk}
                    alt=""
                    onClick={handleClickStartTalkButton}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CreateConversation;
