import React, { useState, useRef, useEffect } from "react";
import StudentLeftMenu from "./Student-Left-Menu";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import avatar from "../assets/default_avatar.svg";
import dot from "../assets/dot.svg";
import plane from "../assets/plane.svg";
import picture from "../assets/picture.svg";
import left_arrow from "../assets/left-arrow.svg";
import CreateConversation from "./CreateConversation";
import { API_ENDPOINT } from "../constants";
import cross from "../assets/cross-1.svg";

const Dashboard_Chatroom_page = () => {
  const [menuVisibleId, setMenuVisibleId] = useState(null); // Track the visible menu by ID
  const [isExpanded, setIsExpanded] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // State to hold the image preview
  const [message, setMessage] = useState(""); // State to hold the message
  const [isMiddleFrameVisible, setIsMiddleFrameVisible] = useState(true); // State to manage middle frame visibility
  const chatRoomRef = useRef(null);
  const textareaRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [currentChatRoomID, setCurrentChatRoomID] = useState("");
  const token = localStorage.getItem("token");
  const sender_id = localStorage.getItem("id");
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(messages);
  const [receiver_id, setReceiver_id] = useState(0);
  const [receiverInfo, setReceiverInfo] = useState([]);
  const [base64Pic, setBase64Pic] = useState("");
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    getUserdialogue();
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

//   this function is used to send users' messages
  const sendMessage = async () => {
    let id = receiver_id;
    try {
      const payload = {
        sender_id: +localStorage.getItem("id"),
        receiver_id: +id,
        content: message,
        pic: base64Pic
      };

      const res = await fetch(`${API_ENDPOINT}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        await getCurrentMessages(id);
      }
    } catch (error) {
      alert("Failed to fetch: 3" + error.message);
    }
  };

  const handleClickSendButton = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage !== "" || base64Pic !== "") {
      sendMessage().then(() => {
        setMessage("");
        setBase64Pic("");
        scrollToBottom();
        setImagePreview(null);
      });
    } else {
      alert("Cannot send empty message.");
      setMessage("");
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        setMessage((prevMessage) => prevMessage);
      } else {
        event.preventDefault();
        handleClickSendButton();
      }
    }
  };

//   Expand pin and Delete options
  const pressDot = (event, id) => {
    event.stopPropagation();
    setMenuVisibleId(menuVisibleId === id ? null : id);
  };

  const handleClickDeleteButton = async (id) => {
    setMenuVisibleId(false);
    try {
      const url = new URL(`${API_ENDPOINT}/delete`);
      url.searchParams.append("other", id);

      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Error occurred while deleting the message");
      } else {
        setConversations((prevConversations) =>
          prevConversations.filter((conversation) => conversation.id !== id)
        );
        if (currentChatRoomID === id.toString()) {
          setMessages([]);
          setReceiverInfo([]);
          setCurrentChatRoomID("");
        }
      }
    } catch (error) {
      alert("Failed to fetch: " + error.message);
    }
  };

  const getUserdialogue = async () => {
    try {
      const res = await fetch(
        `${API_ENDPOINT}/contact_users_and_last_messages`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        const format_conversations = data.data.map((item) => {
          const date = new Date(item.last_message.timestamp);
          const formattedDate = date.toLocaleString("en-US", {
            month: "short",
            day: "numeric"
          });

          return {
            user_avatar: item.user.avatar,
            id: item.user.id,
            name: item.user.user_name,
            email: item.user.email,
            date: formattedDate,
            message: item.last_message.pic
              ? "[PIC]"
              : item.last_message.content,
            is_pin: item.is_pin
          };
        });

        const sorted_conversations = format_conversations.sort(
          (a, b) => b.is_pin - a.is_pin
        );
        setConversations(sorted_conversations);
      }
    } catch (error) {
      alert("Failed to fetch: " + error.message);
    }
  };

  const getCurrentMessages = async (elementId) => {
    let id = elementId;
    if (id === "") {
      const parts = currentChatRoomID.split("-");
      id = parts[2];
    }
    try {
      const res = await fetch(`${API_ENDPOINT}/received?other=${id}`, {
        methods: "GET",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        if (data.data) {
          if (data.data.length === 0) {
            setMessages([]);
          }
          if (
            JSON.stringify(data.data) !== JSON.stringify(messagesRef.current)
          ) {
            setMessages(data.data);
          }

          await getUserdialogue().then(() => {
            const matchedElement = conversations.find(
              (item) => parseInt(item.id, 10) === parseInt(elementId, 10)
            );
            if (matchedElement && conversations.length !== 0) {
              setReceiverInfo([matchedElement.name, matchedElement.email]);
            }
          });
        }
      }
    } catch (error) {
      alert("Failed to fetch: 2" + error.message);
    }
  };
  const handleClickChatRoomContent = async (id) => {
    setIsMiddleFrameVisible(false);
    await getCurrentMessages(id).then(() => {
    });
  };
  const handleImageChange = (event) => {
    setBase64Pic("");
    const file = event.target.files[0];

    if (file) {
      setImagePreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setBase64Pic(base64String);
      };
      event.target.value = null;
      reader.readAsDataURL(file);
    }
  };
  const Get_search_users = async () => {
    try {
      const res = await fetch(
        `${API_ENDPOINT}/search_users?keyword=${searchText}`,
        {
          methods: "GET",
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`
          }
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
            email: user.email
          }));
          if (formattedData.length === 0) {
            alert("No user in database");
          } else {
            setSearchResults(formattedData);
          }
        }
      }
    } catch (error) {
      alert("Failed to fetch: " + error.message);
    }
  };
  const handleClickSearchButton = () => {
    Get_search_users();
  };
  const handleClickCross = () => {
    setSearchResults([]);
  };
  const handleClickPinButton = async (e) => {
    const elementId = e;
    setMenuVisibleId(false);

    try {
      const payload = {
        other_id: +elementId
      };

      const res = await fetch(`${API_ENDPOINT}/convert_pin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setConversations((prevConversations) => {
          const updatedConversations = prevConversations.map((conversation) =>
            conversation.id === elementId
              ? { ...conversation, is_pin: !conversation.is_pin }
              : conversation
          );
          const sortedConversations = updatedConversations.sort(
            (a, b) => b.is_pin - a.is_pin
          );
          return sortedConversations;
        });
        await getUserdialogue();
      }
    } catch (error) {
      alert("Failed to fetch: 4" + error.message);
    }
  };
  return (
    <>
      <div className="Dashboard-root">
        <StudentLeftMenu />
        <Box
          className={`ChatRoom-middle ${
            isMiddleFrameVisible
              ? "ChatRoom-middle-visible"
              : "ChatRoom-middle-hidden"
          }`}
        >
          <div className="ChatRoom-title" style={{ padding: "10px" }}>
            Messages
          </div>
          <Box className="Detail-SearchBox" mb={3} style={{ padding: "10px" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search"
              InputProps={{
                style: { backgroundColor: "#E0E0E0", borderRadius: "50px" }
              }}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
            <Button
              className="Detail-Search-Button"
              sx={{
                fontSize: "1.2rem",
                padding: "10px",
                height: "50px",
                width: "120px",
                marginBottom: "20px",
                textTransform: "none",
                borderRadius: "30px"
              }}
              onClick={handleClickSearchButton}
            >
              Search
            </Button>
          </Box>
          <>
            {searchResults.length !== 0 ? (
              <div style={{ overflow: "auto" }}>
                <img src={cross} onClick={handleClickCross} alt="cross" />
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="ChatRoom-content"
                    onClick={() => {
                      handleClickChatRoomContent(result.id);
                    //   console.log(`id = ${result.email}`);
                      setReceiver_id(result.id);
                      setReceiverInfo([result.name, result.email]);
                    }}
                  >
                    {result.avatar === null || result.avatar === "" ? (
                      <img
                        className="ChatRoom-avatar"
                        src={avatar}
                        alt="avatar"
                      />
                    ) : (
                      <img
                        className="ChatRoom-avatar"
                        src={result.avatar}
                        alt="avatar"
                      />
                    )}

                    <div className="ChatRoom-message">
                      <div className="ChatRoom-text">
                        <div className="ChatRoom-info">
                          <b className="ChatRoom-name">{result.name}</b>
                          <span className="ChatRoom-email">{result.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={
                    conversation.is_pin
                      ? "ChatRoom-content-pin"
                      : "ChatRoom-content"
                  }
                >
                  {conversation.user_avatar === null ||
                  conversation.user_avatar === "" ? (
                    <img
                      className="ChatRoom-avatar"
                      src={avatar}
                      alt="avatar"
                    />
                  ) : (
                    <img
                      className="ChatRoom-avatar"
                      src={conversation.user_avatar}
                      alt="avatar"
                    />
                  )}
                  <div
                    className="ChatRoom-message"
                    onClick={() => {
                      handleClickChatRoomContent(conversation.id);
                      setReceiver_id(conversation.id);
                    }}
                  >
                    <div className="ChatRoom-text">
                      <div className="ChatRoom-info">
                        <b className="ChatRoom-name">{conversation.name}</b>
                        <span className="ChatRoom-email">
                          {conversation.email} ·
                        </span>
                        <span className="ChatRoom-date">
                          {conversation.date}
                        </span>
                      </div>
                      <div className="ChatRoom-lastMessage">
                        {conversation.message}
                      </div>
                    </div>
                  </div>
                  <div className="ChatRoom-dot-container">
                    <img
                      className="ChatRoom-dot"
                      src={dot}
                      alt="dot"
                      onClick={(e) => pressDot(e, conversation.id)}
                    />
                    {menuVisibleId === conversation.id && (
                      <div className="ChatRoom-menu">
                        <div
                          className="ChatRoom-menu-item"
                          onClick={() => {
                            handleClickPinButton(conversation.id);
                          }}
                        >
                          Pin conversation
                        </div>
                        <div
                          className="ChatRoom-menu-item ChatRoom-menu-item-danger"
                          onClick={() => {
                            handleClickDeleteButton(conversation.id);
                            setMessages([]);
                            setReceiverInfo([]);
                          }}
                        >
                          Delete conversation
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </>
        </Box>

        <Box
          className={`ChatRoom-right ${
            isMiddleFrameVisible ? "" : "ChatRoom-right-visible"
          }`}
        >
          <div ref={chatRoomRef} style={{ height: "100%" }}>
            <div className="ChatRoom-detail-header">
              <img
                className="Page-ChatRoomLeftArrow"
                src={left_arrow}
                alt="left arrow"
                onClick={() => setIsMiddleFrameVisible(true)}
              />
              <div className="ChatRoom-detail-text">
                <div className="ChatRoom-detail-title">
                  {receiverInfo[0] ? receiverInfo[0] : "User Name"}
                </div>
                <div className="ChatRoom-detail-email">
                  {receiverInfo[1] ? receiverInfo[1] : "User Email"}
                </div>
              </div>
            </div>
            <div
              className="Page-ChatRoom-Messages"
              style={{ maxHeight: "100%" }}
            >
              {messages && messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.sender_id === parseInt(sender_id)
                        ? "send"
                        : "receive"
                    }
                  >
                    {message.content && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: message.content.replace(/\n/g, "<br>")
                        }}
                      />
                    )}
                    {message.pic && (
                      <img
                        src={message.pic}
                        alt="Message Pic"
                        style={{ width: "100%" }}
                      />
                    )}
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
            <div className="Page-ChatRoom-text-field">
              <div className="ChatRoom-text-field-container">
                <label htmlFor="image-upload">
                  <img src={picture} alt="Upload" className="picture-icons" />
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="image-preview-container">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="image-preview"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="Page-image-remove-button"
                    >
                      &times;
                    </button>
                  </div>
                )}
                <textarea
                  ref={textareaRef}
                  placeholder="Start a new message"
                  className={`ChatRoom-text-field-container-textarea ${
                    imagePreview ? "textarea-with-image" : ""
                  }`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                <img
                  src={plane}
                  alt="Send"
                  className="Page-icon"
                  onClick={handleClickSendButton}
                />
              </div>
            </div>
          </div>
        </Box>
      </div>
    </>
  );
};

export default Dashboard_Chatroom_page;
