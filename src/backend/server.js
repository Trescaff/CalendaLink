const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/userModel');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://faizchan23:OqWnwzVYKtEkN1ws@calendalink.ph2sv.mongodb.net/?retryWrites=true&w=majority&appName=calendalink', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const users = [
  { username: 'admin', password: '1234' },
  { username: 'admin1', password: '1234' }
];

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