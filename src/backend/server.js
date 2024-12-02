const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/userModel');
const nodemailer = require('nodemailer');
//const dotenv = require('dotenv').config();
//const bcrypt = require('bcrypt');    //syunis - hashing dependency

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://faizchan23:OqWnwzVYKtEkN1ws@calendalink.ph2sv.mongodb.net/?retryWrites=true&w=majority&appName=calendalink', {});

// POST: Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  //Syunis 
  //const user = await User.findOne({ username });    //untuk hash
  //const user = users.find(u => u.username === username && u.password === password);
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
    const { username, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    // Hash password
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ username, password });
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
      res.status(200).send(user.calendar);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

//kena tambah 0.0.0.0 ke kat sini?
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// //Email Noder
//  const transporter = nodemailer.createTransport({
//    service: 'gmail',
//    host: "smtp.gmail.com",
//    port: 465, //Port for SSL/TSL
//    secure: true,
//    auth: {
//      user: "amirulhafiz.arman@gmail.com", //sender gmail address
//      pass: "jghk uyst ccac cgzw",    // App password from gmail account
//  },
// });

//  const Option = {
//      from: {
//        name: 'Hafiz',
//        address: "amirulhafiz.arman@gmail.com" 
//    }, //sender adresss
//    to:  "234@gmail.com",// list of yg dpt
//    subject: "HELLO",            // subject line
//    text: "BOy",                 // plain text body
//    html: "<b>Hello World</b>",  // HTML body
//   }

//   const sendMail = async (transporter, Option) => {
//     try {
//       await transporter.sendMail(Option)
//       console.log('Email has been sent');
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   sendMail(transporter, Option);

 const transporter = nodemailer.createTransport({
   service: 'gmail',
   host: "smtp.gmail.com",
   port: 465, //Port for SSL/TSL
   secure: true,
   auth: {
     user: "amirulhafiz.arman@gmail.com", //sender gmail address
     pass: "jghk uyst ccac cgzw",    // App password from gmail account
 },
});

app.post("/send-email", async (req, res) => {
  const {recipientEmail} = req.body;

  if (!recipientEmail) {
    return res.status(400).json({error: "Recipient email is required"});
  }

  const emailOptions = {
    from: {
      name: "Hafiz",
      address: "amirulhafiz.arman@gmail.com"
    },
    to: recipientEmail,
    subject: "Hello",
    text: "testing",
    html: "TEST 1",
  };

  try {
    await transporter.sendMail(emailOptions);
    console.log("Email sent successfully");
    res.status(200).json({ message: "Sent successfully"});
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({error: "Failed"});
  }
});
