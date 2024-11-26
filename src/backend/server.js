const express = require('express');
const cors = require('cors'); //new
const bodyParser = require('body-parser'); //new

const app = express();
const port = 5000;

// Middleware part new
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Sample API Route new
app.get('/api', (req, res) => {
  res.json({ message: 'Backend connected successfully!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
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