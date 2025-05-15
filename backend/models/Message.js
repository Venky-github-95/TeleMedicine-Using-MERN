// // This file defines the Message model for the chat application.
// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//   senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   content: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now },
//   isRead: { type: Boolean, default: false }, // Tracks whether the message has been read
// });

// const Message = mongoose.model('Message', messageSchema);

// module.exports = Message;


const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderModel: { type: String, enum: ['User', 'Doctor'], required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
  receiverModel: { type: String, enum: ['User', 'Doctor'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      ret.senderId = ret.senderId.toString();
      ret.receiverId = ret.receiverId.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;