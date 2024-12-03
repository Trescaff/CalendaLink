const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/userModel');
const nodemailer = require('nodemailer');
//const dotenv = require('dotenv').config();
//const bcrypt = require('bcrypt');    //syunis - hashing dependency
//OI FAIZ
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

app.get('/calendar/remove/:username/:eventId', async (req, res) => {
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
//    to:  "amirulhafiz.arman@gmail.com",// list of yg dpt
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

const verificationCodes = {};

app.post("/Home", async (req, res) => {
  const {email} = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: "Invalid Input"});
  }

  const code = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit code
  verificationCodes[email] = code; // Store the code temporarily

  const emailOptions = {
    from: "amirulhafiz.arman@gmail.com",
    to: email,
    subject: "Verification Code",
    text: `Your verification code is: ${code}`,
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

//CalendarList
// GET: Retrieve all calendars for a user
// app.get('/AllCalendars', async (req, res) => {
//   try {
//     const calendars = await Calendar.find(); 
//     res.status(200).json(calendars);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // POST: Add a new calendar
// app.post('/AllCalendars', async (req, res) => {
//   const { calendarName, imageSrc, userId } = req.body;
//   try {
//     const newCalendar = new Calendar({ calendarName, imageSrc, userId });
//     await newCalendar.save();
//     res.status(201).json(newCalendar);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // PUT: Update a calendar's name
// app.put('/AllCalendars/:id', async (req, res) => {
//   const { id } = req.params;
//   const { calendarName, imageSrc } = req.body;

//   try {
//     const updatedCalendar = await Calendar.findByIdAndUpdate(id, { calendarName, imageSrc }, { new: true });
//     if (!updatedCalendar) return res.status(404).json({ message: 'Calendar not found' });
//     res.status(200).json(updatedCalendar);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // DELETE: Delete a calendar
// app.delete('/AllCalendars/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deletedCalendar = await Calendar.findByIdAndDelete(id);
//     if (!deletedCalendar) return res.status(404).json({ message: 'Calendar not found' });
//     res.status(200).json({ message: 'Calendar deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



