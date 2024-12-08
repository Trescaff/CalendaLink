const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/userModel');
const nodemailer = require('nodemailer');
const fs = require('fs');
const https = require('https');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://faizchan23:OqWnwzVYKtEkN1ws@calendalink.ph2sv.mongodb.net/?retryWrites=true&w=majority&appName=calendalink', {});

// POST: Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({username, password});

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
    console.log('Received data:', { username, event });

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

//app.get('/calendar/remove/:username/:eventId', async (req, res) => {
app.delete('/user/:username/:eventId', async (req, res) => {
  try {
    const { username, eventId } = req.params;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find the event index
    const eventIndex = user.calendar.findIndex(event => event._id.toString() === eventId);
    if (eventIndex === -1) return res.status(404).json({ message: 'Event not found' });

    // Remove the event
    user.calendar.splice(eventIndex, 1);

    // Save the updated user document
    await user.save();

    res.json({ success: true, message: 'Event removed successfully' });
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

app.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send({ message: 'An error occurred' });
  }
});

app.get('/user/:username/friends', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (user) {
      const friends = await User.find({ username: { $in: user.connectedUsers } });
      res.status(200).send(friends);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).send({ message: 'An error occurred' });
  }
});

app.get('/user/:username/events', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (user) {
     if (user.calendar.length === 0) {
        res.status(406).send({ message: 'No events found' });
      }else{
        res.status(200).send(user.calendar);
      }
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching events backend:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

app.get('/user/:username/combined-events', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const connectedUsers = await User.find({ username: { $in: user.connectedUsers } });
    const combinedEvents = connectedUsers.reduce((events, connectedUser) => {
      return events.concat(connectedUser.calendar.map(event => ({
        ...event.toObject(),
        username: connectedUser.username // Add the username to each event
      })));
    }, []);

    const filteredEvents = combinedEvents.filter(event => event.category !== 'Me');

    res.status(200).json(filteredEvents);
  } catch (error) {
    console.error('Error fetching combined events:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Retrieve upcoming events for a user
app.get('/user/:username/upcoming-events', async (req, res) => {
  const { username } = req.params;
  try {
    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get combined events (user's events + connected users' events)
    const connectedUsers = await User.find({ username: { $in: user.connectedUsers } });
    const allEvents = [
      ...user.calendar.map(event => ({ ...event.toObject(), username: user.username })),
      ...connectedUsers.reduce((events, connectedUser) => {
        return events.concat(connectedUser.calendar.map(event => ({
          ...event.toObject(),
          username: connectedUser.username,
        })));
      }, []),
    ];

    // Filter upcoming events
    const today = new Date();
    const upcomingEvents = allEvents.filter(event => {
      const eventDate = new Date(event.date);
      const eventDateTime = new Date(`${event.date}T${event.startTime}`);
      return eventDateTime >= today; // Only future events
    });

    // Sort by date and time
    upcomingEvents.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateA - dateB;
    });

    res.status(200).json(upcomingEvents);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/user/:username/notifications', async (req, res) => {
  const { username } = req.params;
  const { notificationSettings } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notificationSettings = notificationSettings;
    await user.save();

    res.status(200).json({ message: 'Notification settings updated successfully' });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/user/:username/notifications', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.notificationSettings);
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




const transporter = nodemailer.createTransport({
   service: 'gmail',
   host: "smtp.gmail.com",
   port: 465, //Port for SSL/TSL
   secure: true,
   auth: {
     user: "calendalink@gmail.com", //sender gmail address
     pass: "cgml tolo nfke vrbq",    // App password from gmail account
 },
});

const verificationCodes = {};

app.post("/Home", async (req, res) => {
  const {email, username} = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: "Invalid Input"});
  }

  const code = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit code
  verificationCodes[email] = code; // Store the code temporarily

  const emailOptions = {
    from: "calendalink@gmail.com",
    to: email,
    subject: `Verification Code from ${username}`,
    text: `${username} wants to add you as a friend,\nYour verification code is: ${code}`,
  };

  try {
    await transporter.sendMail(emailOptions);
    res.json({ success: true});
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/verify-code", async (req, res) => {
  const {username, email, code } = req.body;
  console.log("Verification codes:", verificationCodes);
  console.log("Email:", email);
  console.log("Code:", code);
  console.log("Verification code:", verificationCodes[email]);

  if (verificationCodes[email] === code) {
    delete verificationCodes[email]; // Remove the code after verification
    console.log("Verification successful");

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "Email not found" });
    }
    
    // Connect the user
    const requestingUser = await User.findOne({ username }); // Replace with actual requesting username
    if (!requestingUser) {
      return res.status(404).json({ success: false, error: "Requesting user not found" });
    }

    if (!requestingUser.connectedUsers.includes(user.username)) {
      requestingUser.connectedUsers.push(user.username);
      await requestingUser.save();
    }

    if (!user.connectedUsers.includes(requestingUser.username)) {
      user.connectedUsers.push(requestingUser.username);
      await user.save();
    }

    res.json({ success: true, message: "User connected successfully", user: user.username });
  } else {
    res.status(400).json({ success: false, error: "Invalid code" });
  }
});

const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Server running on https://localhost:${port}`);
});

