  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import { jwtDecode } from "jwt-decode";

  const ChatHistory = ({ conversation, selectedFriends, socket , setConversation}) => {
    const [Messages, setMessages] = useState([]);
    const user = jwtDecode(localStorage.getItem("user"));
    const [messagesToUpdate, setMessagesToUpdate] = useState([]); // Biến mới để cập nhật tin nhắn mới

    const setConversationCom = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4002/User/Conversation",
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

    useEffect(() => {
      const getMessageAndConversation = async () => {
        // Nếu conversation không tồn tại, thiết lập nó
        if (!conversation && selectedFriends) {
          try {
            await setConversationCom(selectedFriends.user_id, user.user_id);
          } catch (error) {
            console.error("Error setting conversation:", error);
          }
        }
        // Sau khi conversation có giá trị, lấy tin nhắn từ conversation
        if (conversation) {
          try {
            const response = await axios.get(
              `http://localhost:4002/User/GetMessageFromAConversation?conversationid=${conversation.conversationid}`
            );
            const messages = response.data;
            const sortedMessages = messages.sort(
              (a, b) => a.order_sequence - b.order_sequence
            );
            setMessagesToUpdate(sortedMessages); // Cập nhật tin nhắn mới vào biến tạm thời
          } catch (error) {
            console.error("Error fetching messages:", error);
          }
        }
      };

      getMessageAndConversation();
    }, [selectedFriends, user.user_id]);

    const AddMessages = async (message) => {
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.concat(message);
        console.log(updatedMessages); // Log the updated state value
        return updatedMessages;
      });
    }
    

    useEffect(() => {
      // Subscribe to the "messageReceived" event
      socket.on("messageReceived", (message) => {
        console.log('Received message:', message);
        AddMessages(message);
        console.log(Messages); // Sử dụng Messages để xem giá trị hiện tại của state
        setConversationCom();
      });

      // Subscribe to the "MessageSent" event 
      socket.on("messageSent", (message) => {
        console.log('Sent message:', message);
        AddMessages(message);
        console.log(Messages); // Sử dụng Messages để xem giá trị hiện tại của state
        setConversationCom();
      })

      // Clean up subscription when component unmounts
      return () => {
        socket.off("messageReceived");
      };
    }, [socket]);

    useEffect(() => {
      // Cập nhật state Messages khi có tin nhắn mới
      setMessages(messagesToUpdate);
    }, [messagesToUpdate]);
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
