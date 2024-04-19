  import React, { useEffect, useState } from "react";
  import "../Style/Chat.css";
  import axios from "axios";
  import { jwtDecode } from "jwt-decode";
  import ChatHistory from "../Component/ChatHistory";
  import { toast } from "sonner";
  import { IoPersonAddOutline, IoSearch } from "react-icons/io5";
  import { FaCog } from "react-icons/fa";
  import { useNavigate } from "react-router-dom";
  const Chat = ({ socket }) => {
    const [Search, setSearch] = useState("");
    const [Friends, setFriends] = useState([]);
    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState();
    const [selectedFriends, setSelectedFriends] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [conversationSetComplete, setConversationSetComplete] = useState(false);
    const user = jwtDecode(localStorage.getItem("user"));
    

    const setConversationCom = async (friend_id, user_id) => {
      try {
        const response = await axios.post(
          "http://localhost:4002/User/Conversation",
          {
            friend_id: friend_id,
            user_id: user_id,
          }
        );
        setConversation(response.data);
        setConversationSetComplete(true);
      } catch (error) {
        console.error("Error setting conversation:", error);
      }
    };

    const setSelectedFriendsAsync = async (friend) => {
      setSelectedFriends(friend);

    };
    

    useEffect(() => {
      const fetchData = async () => {
        try {
          console.log(user.user_id);
          const result = await axios.get(
            `http://localhost:4002/User/getFriends?user_id=${user.user_id}`
          );
          setFriends(result.data);
          console.log(Friends);
          if (result.data.length > 0) {
            await setSelectedFriendsAsync(result.data[0]);
            await setConversationCom(result.data[0].user_id, user.user_id);
            // Kiểm tra biến trạng thái trước khi gọi console.log(conversation)
            if (conversationSetComplete) {
              console.log(conversation);
            }
          }
        } catch (error) {
          console.error("Error fetching friends:", error);
        } finally {
          setIsLoading(false);
        }
      };
  
      if (user.user_id) {
        fetchData();
      }
    }, [user.user_id, conversationSetComplete]);




    const SendMessage = async (e) => {
      const messageData = {
        conversationid: conversation.conversationid,
        message,
        last_counter: conversation.last_counter,
        sender: user.email,
        status: "sent",
      };
      
      if (message === '') {
        toast.warning("you haven't typed a message");
      } else {
        const sentMessage = await socket.emit("sendMessage", messageData);
        setMessage("");
      }
    };

    return (
      
      <div className="Container">
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card chat-app">
              <div id="plist" className="people-list">
                <div className="input-group">
                  <div className="input-group-prepend" style={{height: '2em', top: '0.5em', position: 'relative'}}>
                    <span className="input-group-text" style={{
                      background: 'linear-gradient(to right, #FF4B2B, #FF416C) no-repeat 0 0 / cover'
                    }}>
                      <i className="fa fa-search" style={{color: '#ffffff'}}></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    style={{height: '2em'}}
                    className="form-control"
                    placeholder="Search..."
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                </div>
                <ul className="list-unstyled chat-list mt-2 mb-0">
                  {Friends.map((friend) => {
                    return (
                      <li
                        className="clearfix"
                        key={friend.user_id}
                        onClick={async() => {
                          await setConversationCom(friend.user_id, user.user_id);
                          setSelectedFriends(friend);
                          console.log(selectedFriends)
                        }}
                      >
                        <img src={friend.avatar} alt="avatar" />
                        <div className="about">
                          <div className="name">{friend.username}</div>
                          <div className="status">
                            {" "}
                            <i className="fa fa-circle offline"></i> left 7 mins
                            ago{" "}
                          </div>
                        </div>
                      </li>
                    );
                  })}

                  <li className="clearfix active">
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar2.png"
                      alt="avatar"
                    />
                    <div className="about">
                      <div className="name">Aiden Chavez</div>
                      <div className="status">
                        {" "}
                        <i className="fa fa-circle online"></i> online{" "}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="chat">
                <div className="chat-header clearfix">
                  <div className="row">
                    <div className="col-lg-6">
                      <a
                        href="javascript:void(0);"
                        data-toggle="modal"
                        data-target="#view_info"
                      >
                        <img
                          src={
                            !isLoading && selectedFriends
                              ? selectedFriends.avatar
                              : "https://via.placeholder.com/50" // placeholder image
                          }
                          alt="avatar"
                        />
                      </a>
                      <div className="chat-about">
                        <h6 className="m-b-0">
                          {!isLoading && selectedFriends
                            ? selectedFriends.username
                            : "Loading..."}
                        </h6>
                        <small>Last seen: 2 hours ago</small>
                      </div>
                    </div>
                    <div className="col-lg-6 hidden-sm text-right">
                      <button
                        className="btn btn-outline-secondary rounded-circle mr-2"
                      >
                        <IoPersonAddOutline />
                      </button>
                      <button
                        className="btn btn-outline-primary rounded-circle mr-2"
                      >
                        <IoSearch />
                      </button>
                      <button
                        className="btn btn-outline-info rounded-circle mr-2"
                      >
                        <FaCog />
                      </button>
                    </div>
                  </div>
                </div>
                <ChatHistory
                  selectedFriends={selectedFriends}
                  conversation={conversation}
                  setConversation={setConversation}
                  socket={socket}
                />
                <div className="chat-message clearfix">
                  <div className="input-group mb-0">
                    <div className="input-group-prepend">
                      <span className="input-group-text h-12 mt-1" style={{height:'2.4em', position:'relative', top: '4px', background: 'linear-gradient(to right, #FF4B2B, #FF416C) no-repeat 0 0 / cover'}}>
                        <button onClick={(e) => {SendMessage(e)}} className="h-12" style={{border: 'none', background: 'transparent'}}>
                          <i className="fa fa-send" style={{color: '#ffffff'}}></i>
                        </button>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control h-12"
                      placeholder="Enter text here..."
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Chat;
