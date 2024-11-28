const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/userModel');

//const bcrypt = require('bcrypt');    //syunis - hashing dependency

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://faizchan23:OqWnwzVYKtEkN1ws@calendalink.ph2sv.mongodb.net/?retryWrites=true&w=majority&appName=calendalink', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

/*const users = [
  { username: 'admin', password: '1234' },
  { username: 'admin1', password: '1234' }
];*/

//const mongoose = require('mongoose');
const users = new mongoose.Schema({    //Syunis
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
      startTime: { type: Date, required: true }, // Start time of the event
      endTime: { type: Date, required: true }, // End time of the event
      date: { type: Date, required: true }, // Event date
      location: { type: String }, // Optional event location
      category: { type: String }, // Event category (e.g., Work, Personal)
      url: { type: String }, // Optional related URL (e.g., Zoom link)
      notifications: {
        repeat: { type: String, enum: ['Never', 'Daily', 'Weekly', 'Monthly'], default: 'Never' }, // Repeat setting
        methods: { type: [String], enum: ['Email', 'Push', 'SMS'], default: ['Email'] }, // Notification methods
      },
      participants: [String], // List of connected users (usernames)
    },
  ],
  connectedUsers: [{ type: String }], // List of connected usernames
  createdAt: { type: Date, default: Date.now }, // When the user was created
});

//const User = mongoose.model('User', users);

module.exports = User;

// POST: Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  //Syunis 
  //const user = await User.findOne({ username });    //untuk hash
  const user = users.find(u => u.username === username && u.password === password);
  //const user = await User.findOne({username, password});

  if (user) {
    res.status(200).send({ message: 'Login successful' });
  } else {
    res.status(401).send({ message: 'Invalid credentials' });
  }
});

//Syunis
// POST: Register
app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    // Hash password
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ username, password, email });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST: Add event to user's calendar
app.post('/calendar/add', async (req, res) => {
  try {
    const { username, event } = req.body;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Add the event
    user.calendar.push(event);
    await user.save();

    res.status(201).json({ message: 'Event added successfully', calendar: user.calendar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Retrieve user's calendar
app.get('/calendar/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ calendar: user.calendar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST: Connect users
app.post('/users/connect', async (req, res) => {
  try {
    const { username, connectTo } = req.body;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Add the connected user
    if (!user.connectedUsers.includes(connectTo)) {
      user.connectedUsers.push(connectTo);
      await user.save();
    }

    res.status(200).json({ message: 'User connected successfully', connectedUsers: user.connectedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
//sampai sini sahaja sekian


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

//test pull
//test push

// const express = require("express");
// const app = express();
// const cors = require("cors");

// // Import routes
// const usersRouter = require('./routes/users');
// const inboundRouter = require('./routes/inbound');
// const outboundRouter = require('./routes/outbound');
// const inventoryRouter = require('./routes/inventory');

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Routes
// app.use('/api/users', usersRouter);
// app.use('/api/inbound', inboundRouter);
// app.use('/api/outbound', outboundRouter);
// app.use('/api/inventory', inventoryRouter);

// // Start the server
// app.listen(8080, () => {
//     console.log("Server started on port 8080");
// });

// // Get all inbound products
// router.get('/', (req, res) => {
//   db.query('SELECT * FROM inbound', [], (err, results) => {
//       if (err) {
//           console.error('Database error:', err);
//           return res.status(500).json({ error: 'Database query failed' });
//       }
//       res.json(results);
//   });
// });