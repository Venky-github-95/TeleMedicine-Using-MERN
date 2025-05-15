import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css';

const MessagePage = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctors/all');
      setDoctors(res.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const handleDoctorClick = async (doctor) => {
    setSelectedDoctor(doctor);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/messages/with/${doctor._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data.messages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await axios.post(
        'http://localhost:5000/api/messages/send',
        {
          receiverId: selectedDoctor._id,
          receiverModel: 'Doctor',
          content: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages([...messages, res.data.message]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="general-chats-container">
      <div className="users-list">
        <h2>Doctors</h2>
        {doctors.map((doc) => (
          <div key={doc._id} className="user-card" onClick={() => handleDoctorClick(doc)}>
            <img src={doc.photoUrl} alt={doc.name} className="user-image" />
            <div>
              <h3>{doc.name}</h3>
              <p>{doc.specialty}</p>
              <p>{doc.available}</p>
              <p>📞 {doc.contactNumber}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-screen">
        {selectedDoctor ? (
          <>
            <div className="chat-header">
              <h3>{selectedDoctor.name}</h3>
              <p>{selectedDoctor.specialty} | {selectedDoctor.available}</p>
            </div>
            <div className="chat-messages">
              {messages.length === 0 ? (
                <p className="no-messages">No messages yet. Start chatting!</p>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`message ${msg.senderId === userId ? 'sent' : 'received'}`}
                  >
                    {/* <span>{msg.senderId === userId ? 'You' : selectedDoctor.name}:</span> */}
                     {/* <span className='message'> {msg.content} </span> */}
                    <span>{msg.senderModel}:</span> {msg.content}

                    <div className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                  </div>
                ))
              )}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p className="select-user-message">Select a doctor to start chatting.</p>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
