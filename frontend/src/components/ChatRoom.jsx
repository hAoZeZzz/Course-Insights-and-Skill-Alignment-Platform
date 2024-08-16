import React, { useEffect, useState, useRef } from "react";
import avatar from "../assets/default_avatar.svg";
import message_pic from "../assets/create-new-message.svg";
import double_up_arrow from "../assets/double-up-arrow.svg";
import double_down_arrow from "../assets/double-down-arrow.svg";
import plane from "../assets/plane.svg";
import picture from "../assets/picture.svg";
import dot from "../assets/dot.svg";
import left_arrow from "../assets/left-arrow.svg";
import CreateConversation from "./CreateConversation";
import { useLocation } from "react-router-dom";
import { API_ENDPOINT } from "../constants";

const ChatRoom = () => {
  const [isExpanded, setIsExpanded] = useState(false); // to control the state of chatroom if it is expanded.
  const [isChatVisible, setIsChatVisible] = useState(false); // to control whether the chat room is visible or not
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [base64Pic, setBase64Pic] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [currentChatRoomID, setCurrentChatRoomID] = useState("");
  const [conversations, setConversations] = useState([]);
  const token = localStorage.getItem("token");
  const [messages, setMessages] = useState([]);
  const [receiver_id, setReceiver_id] = useState("");
  const [receiverInfo, setReceiverInfo] = useState([]);
  const chatRoomRef = useRef(null);
  const textareaRef = useRef(null);
  const location = useLocation();
  const sender_id = localStorage.getItem("id");
  const messagesEndRef = useRef(null);
  const messagesRef = useRef(messages);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    handleMessageExpand();
  };

  const clickContent = (e) => {
    setIsChatVisible(!isChatVisible);
    setIsExpanded(true);
  };
  const handleClickLeftArrow = () => {
    setIsChatVisible(!isChatVisible);
    setIsExpanded(true);
    setMessages([]);
    getUserdialogue();
  };

  const pressDot = (event, id) => {
    event.stopPropagation();
    setMenuVisibleId(menuVisibleId === id ? null : id);
  };

  const handleClickOutside = (event) => {
    if (chatRoomRef.current && !chatRoomRef.current.contains(event.target)) {
      if (isExpanded) {
        // setIsExpanded(false);
      }
      if (menuVisibleId) {
        setMenuVisibleId(null);
      }
    }
  };
  const handleChickCreateConversation = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  useEffect(() => {
    if (isExpanded || isSearchVisible) {
      document.documentElement.classList.add("no-scroll");
    } else {
      document.documentElement.classList.remove("no-scroll");
    }

    return () => {
      document.documentElement.classList.remove("no-scroll");
    };
  }, [isExpanded, isSearchVisible]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, menuVisibleId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);
  useEffect(() => {
    scrollToBottom();
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    if (isExpanded && isChatVisible) {
      const interval = setInterval(() => {
        getCurrentMessages(receiver_id);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [receiver_id, isExpanded, isChatVisible]);

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
  const handleRemoveImage = () => {
    setImagePreview(null);
    setBase64Pic("");
  };
  if (
    location.pathname === "/dashboard/chatroom" ||
    localStorage.getItem("token") === null
  ) {
    return null;
  }

  const getUserdialogue = async () => {
    try {
      const res = await fetch(
        `${API_ENDPOINT}/contact_users_and_last_messages`,
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
        const format_conversations = data.data.map((item) => {
          const date = new Date(item.last_message.timestamp);
          const formattedDate = date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
          });
        //   console.log(data.data);

          return {
            user_avatar: item.user.avatar,
            id: item.user.id,
            name: item.user.user_name,
            email: item.user.email,
            date: formattedDate,
            message: item.last_message.pic
              ? "[PIC]"
              : item.last_message.content,
            is_pin: item.is_pin,
          };
        });
        // to sort the conversation if some of them are pinned.
        const sorted_conversations = format_conversations.sort(
          (a, b) => b.is_pin - a.is_pin
        );
        setConversations(sorted_conversations);
      }
    } catch (error) {
      alert("Failed to fetch: " + error.message);
    }
  };

  const handleClickOneUserDialogue = (e) => {
    const clickedElement = e.currentTarget;
    const elementId = clickedElement.id;
    setCurrentChatRoomID(elementId);
    getCurrentMessages(elementId);
    setReceiver_id(elementId);
  };
  const handleMessageExpand = () => {
    if (!isExpanded) {
      getUserdialogue();
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
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        if (data.data) {
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

  // Use the api to send the message to the server
  const sendMessage = async () => {
    let id = currentChatRoomID;
    const parts = currentChatRoomID.split("-");
    // console.log(parts);
    if (parts.length !== 1) {
      id = parts[2];
    }

    try {
      const payload = {
        sender_id: +localStorage.getItem("id"),
        receiver_id: +id,
        content: message,
        pic: base64Pic,
      };

      const res = await fetch(`${API_ENDPOINT}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        // console.log(data);
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

  const handleDataFromCreate = (data) => {
    setCurrentChatRoomID(data);
    getCurrentMessages();
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
  const handleClickPinButton = async (e) => {
    const clickedElement = e.currentTarget;
    const elementId = clickedElement.id;
    setMenuVisibleId(false);
    try {
      const payload = {
        other_id: +elementId,
      };

      const res = await fetch(`${API_ENDPOINT}/convert_pin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        console.log(data);
      }
    } catch (error) {
      alert("Failed to fetch: 4" + error.message);
    }
  };
  const handleClickDeleteButton = async (e) => {
    const clickedElement = e.currentTarget;
    const elementId = clickedElement.id;
    setMenuVisibleId(false);
    // console.log(elementId);
    try {
      const url = new URL(`${API_ENDPOINT}/delete`);
      url.searchParams.append("other", elementId);

      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Error occurred while deleting the message");
      } else {
        const data = await res.json();
        console.log(data);
      }
    } catch (error) {
      alert("Failed to fetch: " + error.message);
    }
  };

  return (
    <>
      {!isChatVisible && (
        <div
          ref={chatRoomRef}
          className={`ChatRoom ${isExpanded ? "expanded" : "collapsed"}`}
        >
          <div className="ChatRoom-header">
            <div className="ChatRoom-title"onClick={toggleExpand}>Messages</div>
            <div className="ChatRoom-icons">
              <img
                src={message_pic}
                alt="message icon"
                onClick={handleChickCreateConversation}
              />
              <img
                src={isExpanded ? double_down_arrow : double_up_arrow}
                alt="toggle icon"
                onClick={toggleExpand}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
          {isExpanded && (
            <div>
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  id={conversation.id}
                  className={
                    conversation.is_pin
                      ? "ChatRoom-content-pin"
                      : "ChatRoom-content"
                  }
                  onClick={handleClickOneUserDialogue}
                >
                  <img
                    className="ChatRoom-avatar"
                    id={conversation.id}
                    src={
                      conversation.user_avatar
                        ? conversation.user_avatar
                        : avatar
                    }
                    alt="avatar"
                    onClick={() => {
                      clickContent();
                    }}
                  />
                  <div className="ChatRoom-message" onClick={clickContent}>
                    <div className="ChatRoom-text">
                      <div className="ChatRoom-info">
                        <b className="ChatRoom-name">
                          {conversation.name ? conversation.name : "null"}
                        </b>

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
                      style={{ height: "25px" }}
                      onClick={(e) => pressDot(e, conversation.id)}
                    />
                    {menuVisibleId === conversation.id && (
                      <div className="ChatRoom-menu">
                        <div
                          id={conversation.id}
                          className="ChatRoom-menu-item"
                          onClick={handleClickPinButton}
                        >
                          Pin conversation
                        </div>
                        <div
                          id={conversation.id}
                          className="ChatRoom-menu-item ChatRoom-menu-item-danger"
                          onClick={handleClickDeleteButton}
                        >
                          Delete conversation
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isChatVisible && (
        <div
          ref={chatRoomRef}
          className={`ChatRoom ${isExpanded ? "detail" : "collapsed"}`}
        >
          <div className="ChatRoom-detail-header">
            <img
              className="ChatRoomLeftArrow"
              src={left_arrow}
              alt=""
              onClick={handleClickLeftArrow}
            />
            <div className="ChatRoom-detail-text">
              {receiverInfo[0] ? (
                <div className="ChatRoom-detail-title">{receiverInfo[0]}</div>
              ) : (
                <div className="ChatRoom-detail-title">null</div>
              )}
              <div className="ChatRoom-detail-email">{receiverInfo[1]}</div>
            </div>
            <img
              src={isExpanded ? double_down_arrow : double_up_arrow}
              alt="toggle icon"
              onClick={toggleExpand}
              style={{ cursor: "pointer" }}
              className="ChatRoom-detail-icon"
            />
          </div>
          <div className="ChatRoom-Messages">
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
                        __html: message.content.replace(/\n/g, "<br>"),
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
            <div ref={messagesEndRef} />
          </div>
          <div className="ChatRoom-text-field">
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
                    className="image-remove-button"
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
                className="icon"
                onClick={handleClickSendButton}
              />
            </div>
          </div>
        </div>
      )}
      <CreateConversation
        isSearchVisible={isSearchVisible}
        setIsSearchVisible={setIsSearchVisible}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isChatVisible={isChatVisible}
        setIsChatVisible={setIsChatVisible}
        currentChatRoomID={currentChatRoomID}
        setCurrentChatRoomID={setCurrentChatRoomID}
        onData={handleDataFromCreate}
        receiverInfo={receiverInfo}
        setReceiverInfo={setReceiverInfo}
        messages={messages}
        setMessages={setMessages}
        messagesRef={messagesRef}
        conversations={conversations}
        receiver_id={receiver_id}
        setReceiver_id={setReceiver_id}
      />
    </>
  );
};

export default ChatRoom;
