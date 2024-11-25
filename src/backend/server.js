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
