import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ChatHistory = ({ conversation, selectedFriends, setConversation }) => {
  const [Messages, setMessages] = useState([]);
  const user = jwtDecode(localStorage.getItem("user"));

  useEffect(() => {
    const GetMessageFromAConversation = async () => {
      if (conversation) {
        try {
          const response = await axios.get(
            `http://localhost:4000/User/GetMessageFromAConversation?conversationid=${conversation.conversationid}`
          );
          const messages = response.data;
          const sortedMessages = messages.sort(
            (a, b) => a.order_sequence - b.order_sequence
          );
          setMessages(sortedMessages);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    const setConversationCom = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4000/User/Conversation",
          {
            friend_id: selectedFriends.user_id,
            user_id: user.user_id,
          }
        );
        setConversation(response.data);
      } catch (error) {
        console.error("Error setting conversation:", error);
      }
    };

    if (selectedFriends) {
      setConversationCom();
      GetMessageFromAConversation();
    }
  }, [conversation, selectedFriends, setConversation, user.user_id]);

  return (
    <div
      className="chat-history"
      style={{ height: "750px", overflowY: "auto" }}
    >
      <ul className="m-b-0">
        {Messages.map((message) =>
          message.sender === user.email ? (
            <li className="clearfix" key={message.messageid}>
              <div className="message-data text-right">
                <span className="message-data-time">
                  {new Date(message.createddate).toLocaleString()}
                </span>
                <img src={user.Avatar} alt="avatar" />
              </div>
              <div className="message other-message float-right">
                {message.message}
              </div>
            </li>
          ) : (
            <li className="clearfix" key={message.messageid}>
              <div className="message-data">
                <span className="message-data-time">
                  {new Date(message.createddate).toLocaleString()}
                </span>
              </div>
              <div className="message my-message">{message.message}</div>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default ChatHistory;
