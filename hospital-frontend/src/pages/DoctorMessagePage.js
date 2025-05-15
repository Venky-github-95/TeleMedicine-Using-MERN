import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css';

const DoctorMessagePage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const token = localStorage.getItem('token'); // assuming doctor logs in and token is stored

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get('http://localhost:5000/api/messages/from-users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
    };
    fetchUsers();
  }, []);

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    const res = await axios.get(`http://localhost:5000/api/messages/with-user/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(res.data.messages);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const res = await axios.post(
      'http://localhost:5000/api/messages/send-from-doctor',
      {
        receiverId: selectedUser._id,
        content: newMessage,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMessages([...messages, res.data.message]);
    setNewMessage('');
  };

  return (
    <div className="general-chats-container">
      <div className="users-list">
        <h2>Users</h2>
        {users.map((user) => (
          <div key={user._id} className="user-card" onClick={() => handleUserClick(user)}>
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-screen">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <h3>{selectedUser.name}</h3>
              <p>{selectedUser.email}</p>
            </div>
            <div className="chat-messages">
              {messages.length === 0 ? (
                <p className="no-messages">No messages yet.</p>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${message.senderModel === 'Doctor' ? 'sent' : 'received'}`}
                  >
                    <span>{message.senderModel}:</span> {message.content}
                  </div>
                ))
              )}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type your reply..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p className="select-user-message">Select a user to start chatting.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorMessagePage;
