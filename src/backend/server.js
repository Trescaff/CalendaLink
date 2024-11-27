<<<<<<< HEAD
const app = require('./app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const User = require('./models/userModel');
// const app = require('./app');

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://0.0.0.0:${PORT}`);
=======
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/userModel');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

// mongoose.connect('mongodb+srv://faizchan23:OqWnwzVYKtEkN1ws@calendalink.ph2sv.mongodb.net/?retryWrites=true&w=majority&appName=calendalink', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// });

const users = [
  { username: 'admin', password: '1234' },
  { username: 'admin1', password: '1234' }
];

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    //const existingUser = await User.findOne({ username });
    const existingUser = users.find(u => u.username === username && u.password === password);
    if (existingUser) {
      return res.status(400).send({message: 'Username already exists' });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).send({ message: 'An error occurred' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  //const user = await User.findOne({username, password});

  if (user) {
    res.status(200).send({ message: 'Login successful' });
  } else {
    res.status(401).send({ message: 'Invalid credentials' });
  }
});

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
>>>>>>> f101d96016ba3acea83fc7382b8595384e490ee7
// });

// const app = express();
// const port = 5000;

// app.use(bodyParser.json());
// app.use(cors());

// mongoose.connect('mongodb+srv://faizchan23:OqWnwzVYKtEkN1ws@calendalink.ph2sv.mongodb.net/?retryWrites=true&w=majority&appName=calendalink', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// });

// const users = [
//   { username: 'admin', password: '1234' },
//   { username: 'admin1', password: '1234' }
// ];

// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find(u => u.username === username && u.password === password);
//   //const user = await User.findOne({username, password});
//   const app = require('./app');

//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`Server is running on http://0.0.0.0:${PORT}`);
//   });
  
//   if (user) {
//     res.status(200).send({ message: 'Login successful' });
//   } else {
//     res.status(401).send({ message: 'Invalid credentials' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

// //test pull
// //test push

// // const express = require("express");
// // const app = express();
// // const cors = require("cors");

// // // Import routes
// // const usersRouter = require('./routes/users');
// // const inboundRouter = require('./routes/inbound');
// // const outboundRouter = require('./routes/outbound');
// // const inventoryRouter = require('./routes/inventory');

// // // Middleware
// // app.use(express.json());
// // app.use(cors());

// // // Routes
// // app.use('/api/users', usersRouter);
// // app.use('/api/inbound', inboundRouter);
// // app.use('/api/outbound', outboundRouter);
// // app.use('/api/inventory', inventoryRouter);

// // // Start the server
// // app.listen(8080, () => {
// //     console.log("Server started on port 8080");
// // });

// // // Get all inbound products
// // router.get('/', (req, res) => {
// //   db.query('SELECT * FROM inbound', [], (err, results) => {
// //       if (err) {
// //           console.error('Database error:', err);
// //           return res.status(500).json({ error: 'Database query failed' });
// //       }
// //       res.json(results);
// //   });
// // });
// >>>>>>> c8c6e4cb402ae174907d251a4918ddb5b47b93c8
