const users = [
    { username: 'admin', password: '1234' },
    { username: 'admin1', password: '1234' }
  ];
  
  // Login logic
  export function   login(req, res) {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      res.status(200).send({ message: 'Login successful' });
    } else {
      res.status(401).send({ message: 'Invalid credentials' });
    }
  }
  