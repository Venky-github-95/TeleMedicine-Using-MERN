// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Messaging = ({ selectedId: propSelectedId }) => {
//   const [messages, setMessages] = useState([]);
//   const [content, setContent] = useState('');
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [recipient, setRecipient] = useState(null);
//   const token = localStorage.getItem('token');
//   const userId = localStorage.getItem('userId');
// // const userId = req.user.id.toString();
// // const receiverId = req.params.receiverId.toString();

//   const selectedId = propSelectedId || JSON.parse(localStorage.getItem('selectedDoctor'))?.id;

//   useEffect(() => {
//     const selectedDoctor = localStorage.getItem('selectedDoctor');
//     if (selectedDoctor) {
//       setRecipient(JSON.parse(selectedDoctor));
//     }
//   }, []);

//   const fetchMessages = async () => {
//     console.log("selectedId:", selectedId);
//     if (!selectedId) return;
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/messages/with/${selectedId}?page=${page}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setMessages(response.data.messages);
//       setTotalPages(response.data.totalPages || 1);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };
      
//     useEffect(() => {
//       if (propSelectedId) {
//         setRecipient({ id: propSelectedId, name: 'Doctor' }); // optionally fetch name
//       } else {
//         const selectedDoctor = JSON.parse(localStorage.getItem('selectedDoctor'));
//         if (selectedDoctor) setRecipient(selectedDoctor);
//       }
//     }, [propSelectedId]);

//   const sendMessage = async () => {
//     if (!recipient?.id || !content.trim()) {
//       alert('Cannot send empty message or missing recipient.');
//       return;
//     }

//     try {
//       const res = await axios.post(
//         'http://localhost:5000/api/messages/send',
//         {
//           receiverId: recipient.id,
//           receiverModel: 'Doctor', // Change to 'User' if needed
//           content,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (res.data.success) {
//         setContent('');
//         fetchMessages(); // Refresh messages
//       }
//     } catch (err) {
//       console.error('Error sending message:', err);
//     }
//   };

//   const clearChat = async () => {
//     if (!recipient) return;
//     const confirmed = window.confirm('Clear the entire chat history?');
//     if (!confirmed) return;

//     try {
//       await axios.delete(`http://localhost:5000/api/messages/clear/${recipient.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessages([]);
//     } catch (err) {
//       console.error('Error clearing chat:', err);
//     }
//   };

//   useEffect(() => {
//     if (recipient && selectedId) {
//       fetchMessages();
//     }
//   }, [page, recipient, selectedId]);

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         <h2>Chat with {recipient?.name || '...'}</h2>
//         <button onClick={clearChat}>Clear Chat</button>
//       </div>

//       <div className="chat-box">
//         {messages?.length > 0 ? (
//           messages.map((msg, i) => (
//             <div
//               key={i}
//               className={`chat-message ${msg.senderId === userId ? 'sent' : 'received'}`}
//             >
//               <p>{msg.content}</p>
//                 <span>{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}</span>
//             </div>
//           ))
//         ) : (
//           <p>No messages yet</p>
//         )}
//       </div>

//       {totalPages > 1 && (
//         <div className="pagination">
//           <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
//             Prev
//           </button>
//           <span>
//             Page {page} of {totalPages}
//           </span>
//           <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
//             Next
//           </button>
//         </div>
//       )}

//       <div className="chat-input">
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Messaging;



// // Messaging.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Messaging = ({ selectedId: propSelectedId }) => {
//   const [messages, setMessages] = useState([]);
//   const [content, setContent] = useState('');
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [recipient, setRecipient] = useState(null);

//   const token = localStorage.getItem('token');
//   const userId = localStorage.getItem('userId');
//   const selectedId = propSelectedId || JSON.parse(localStorage.getItem('selectedDoctor'))?.id;

//   useEffect(() => {
//     const selectedDoctor = localStorage.getItem('selectedDoctor');
//     if (selectedDoctor) {
//       setRecipient(JSON.parse(selectedDoctor));
//     }
//   }, []);

  
//   useEffect(() => {
//     if (selectedId) {
//       fetchMessages();
//     }
//   }, [selectedId, page]);

//   const fetchMessages = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/messages/with/${selectedId}?page=${page}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMessages(res.data.messages);
//       setTotalPages(res.data.totalPages || 1);
//     } catch (err) {
//       console.error('Error fetching messages:', err);
//     }
//   };

//   const sendMessage = async () => {
//   if (!recipient?.id || !content.trim()) {
//     alert('Cannot send empty message or missing recipient.');
//     return;
//   }
//   console.log('Sending message to recipient:', recipient.id, 'Content:', content); // Debug log
//   try {
//     const res = await axios.post(
//       'http://localhost:5000/api/messages/send',
//       {
//         receiverId: recipient.id,
//         receiverModel: 'Doctor',
//         content,
//       },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     if (res.data.success) {
//       setContent('');
//       setPage(1); // Go to latest messages after sending
//       fetchMessages(); // Refresh messages
//     }
//   } catch (err) {
//     console.error('Error sending message:', err);
//   }
// };


//   const clearChat = async () => {
//     if (!recipient) return;
//     const confirmed = window.confirm('Clear the entire chat history?');
//     if (!confirmed) return;

//     try {
//       await axios.delete(`http://localhost:5000/api/messages/clear/${recipient.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessages([]);
//     } catch (err) {
//       console.error('Error clearing chat:', err);
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         <h2>Chat with {recipient?.name || '...'}</h2>
//         <button onClick={clearChat}>Clear Chat</button>
//       </div>

//       <div className="chat-box">
//         {messages?.length > 0 ? (
//           messages.map((msg, i) => (
//             <div
//               key={i}
//                 className={`chat-message ${msg.senderId.toString() === userId ? 'sent' : 'received'}`}
//             >
//               <p>{msg.content}</p>
//               <span>{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}</span>
//             </div>
//           ))
//         ) : (
//           <p>No messages yet</p>
//         )}
//       </div>

//       {totalPages > 1 && (
//         <div className="pagination">
//           <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
//           <span>Page {page} of {totalPages}</span>
//           <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
//         </div>
//       )}

//       <div className="chat-input">
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Messaging;



import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Messaging = ({ selectedId: propSelectedId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recipient, setRecipient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role');
  const selectedId = propSelectedId || JSON.parse(localStorage.getItem('selectedDoctor'))?.id;

  useEffect(() => {
    const fetchRecipient = async () => {
      if (propSelectedId) {
        try {
          const endpoint = userRole === 'user' 
            ? `http://localhost:5000/api/doctors/${propSelectedId}`
            : `http://localhost:5000/api/users/${propSelectedId}`;
            
          const response = await axios.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRecipient(response.data);
        } catch (error) {
          console.error('Error fetching recipient:', error);
        }
      } else {
        const selectedContact = JSON.parse(localStorage.getItem('selectedDoctor') || localStorage.getItem('selectedUser'));
        if (selectedContact) setRecipient(selectedContact);
      }
    };
    
    fetchRecipient();
  }, [propSelectedId, token, userRole]);

  const fetchMessages = async () => {
    if (!selectedId) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/with/${selectedId}?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessages(response.data.messages);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedId) {
      fetchMessages();
    }
  }, [selectedId, page]);

  const sendMessage = async () => {
    if (!recipient?.id || !content.trim()) {
      alert('Cannot send empty message or missing recipient.');
      return;
    }

    try {
      const receiverModel = userRole === 'user' ? 'Doctor' : 'User';
      
      const res = await axios.post(
        'http://localhost:5000/api/messages/send',
        {
          receiverId: recipient.id,
          receiverModel,
          content
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (res.data.success) {
        setContent('');
        setPage(1);
        await fetchMessages();
        
        setTimeout(() => {
          const chatBox = document.querySelector('.chat-box');
          if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        }, 100);
      }
    } catch (err) {
      console.error('Message send error:', err);
      alert(err.response?.data?.error || err.message || 'Failed to send message');
    }
  };

  const clearChat = async () => {
    if (!recipient) return;
    const confirmed = window.confirm('Clear the entire chat history?');
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/messages/clear/${recipient.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages([]);
    } catch (err) {
      console.error('Error clearing chat:', err);
      alert('Failed to clear chat. Please try again.');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with {recipient?.name || '...'}</h2>
        <button onClick={clearChat}>Clear Chat</button>
      </div>

      <div className="chat-box">
        {isLoading ? (
          <p>Loading messages...</p>
        ) : messages?.length > 0 ? (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-message ${msg.senderId === userId ? 'sent' : 'received'}`}
            >
              <p>{msg.content}</p>
              <span>{msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}</span>
            </div>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Messaging;