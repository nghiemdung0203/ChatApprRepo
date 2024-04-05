import React, { useEffect, useState } from "react";
import "../Style/Chat.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ChatHistory from "../Component/ChatHistory";
import { toast } from "sonner";

const Chat = ({ socket }) => {
  const [Search, setSearch] = useState("");
  const [Friends, setFriends] = useState([]);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState();
  const [selectedFriends, setSelectedFriends] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const user = jwtDecode(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(user.user_id);
        const result = await axios.get(
          `http://localhost:4002/User/getFriends?user_id=${user.user_id}`
        );
        setFriends(result.data);
        if (result.data.length > 0) {
          setSelectedFriends(result.data[0]);
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
  }, [user.user_id]);

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
    } catch (error) {
      console.error("Error setting conversation:", error);
    }
  };

  const SendMessage = async () => {
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
    }
    
    setMessage("");
  };

  return (
    
    <div className="Container">
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card chat-app">
            <div id="plist" className="people-list">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fa fa-search"></i>
                  </span>
                </div>
                <input
                  type="text"
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
                      onClick={() => {
                        setConversationCom(friend.user_id, user.user_id);
                        setSelectedFriends(friend);
                        console.log(selectedFriends);
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
                    <a
                      href="javascript:void(0);"
                      className="btn btn-outline-secondary"
                    >
                      <i className="fa fa-camera"></i>
                    </a>
                    <a
                      href="javascript:void(0);"
                      className="btn btn-outline-primary"
                    >
                      <i className="fa fa-image"></i>
                    </a>
                    <a
                      href="javascript:void(0);"
                      className="btn btn-outline-info"
                    >
                      <i className="fa fa-cogs"></i>
                    </a>
                    <a
                      href="javascript:void(0);"
                      className="btn btn-outline-warning"
                    >
                      <i className="fa fa-question"></i>
                    </a>
                  </div>
                </div>
              </div>
              <ChatHistory
                conversation={conversation}
                selectedFriends={selectedFriends}
                setConversation={setConversation}
              />
              <div className="chat-message clearfix">
                <div className="input-group mb-0">
                  <div className="input-group-prepend">
                    <span className="input-group-text h-12 mt-1">
                      <button onClick={SendMessage} className="h-12">
                        <i className="fa fa-send"></i>
                      </button>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control h-12"
                    placeholder="Enter text here..."
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
