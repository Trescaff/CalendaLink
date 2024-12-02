const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String }, // Optional
  fullName: { type: String }, // Optional
  profilePictureURL: { type: String }, // Optional URL for profile picture
  location: { type: String }, // Optional user location
  calendar: [
    {
      title: { type: String, required: true }, // Event title
      description: { type: String }, // Optional event description
      startTime: { type: String, required: true }, // Start time of the event
      endTime: { type: String, required: true }, // End time of the event
      date: { type: Date, required: true }, // Event date
      location: { type: String }, // Optional event location
      category: { type: String }, // Event category (e.g., Work, Personal)
      url: { type: String }, // Optional URL for event
      notifications: {
        repeat: { type: String, enum: ['Never', 'Daily', 'Weekly', 'Monthly'], default: 'Never' },
        methods: { type: [String], enum: ['Email', 'Push', 'SMS'], default: ['Email'] },
      },
      participants: [String], // List of participants
    },
  ],
  connectedUsers: [{ type: String }], // List of connected users
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;


//const mongoose = require('mongoose');
// const users = new mongoose.Schema({    //Syunis
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true }, // Hashed password
//   email: { type: String, required: true, unique: true },
//   phoneNumber: { type: String }, // Optional
//   fullName: { type: String }, // Optional
//   profilePictureURL: { type: String }, // Optional URL for profile picture
//   location: { type: String }, // Optional user location
//   calendar: [
//     {
//       title: { type: String, required: true }, // Event title
//       description: { type: String }, // Optional event description
//       startTime: { type: Date, required: true }, // Start time of the event
//       endTime: { type: Date, required: true }, // End time of the event
//       date: { type: Date, required: true }, // Event date
//       location: { type: String }, // Optional event location
//       category: { type: String }, // Event category (e.g., Work, Personal)
//       url: { type: String }, // Optional related URL (e.g., Zoom link)
//       notifications: {
//         repeat: { type: String, enum: ['Never', 'Daily', 'Weekly', 'Monthly'], default: 'Never' }, // Repeat setting
//         methods: { type: [String], enum: ['Email', 'Push', 'SMS'], default: ['Email'] }, // Notification methods
//       },
//       participants: [String], // List of connected users (usernames)
//     },
//   ],
//   connectedUsers: [{ type: String }], // List of connected usernames
//   createdAt: { type: Date, default: Date.now }, // When the user was created
// });

// //const User = mongoose.model('User', users);

// module.exports = User;