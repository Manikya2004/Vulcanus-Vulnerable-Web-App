const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'vulnerable_app',
  multipleStatements: true
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL database.');
  }
});

const requireAuth = (req, res, next) => {
  const username = req.cookies.session_user;
  if (!username) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }
  req.user = username;
  next();
};

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

  const query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json({ message: 'User registered successfully!' });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error', details: err.message, query: query });
    }

    if (results.length > 0) {
      const user = results[0];
      res.cookie('session_user', user.username, {
        maxAge: 900000,
      });
      res.json({ message: 'Login successful', user: { username: user.username, bio: user.bio } });
    } else {
      res.status(401).json({ error: 'Invalid credentials', query: query });
    }
  });
});

app.post('/api/update-profile', requireAuth, (req, res) => {
  const { bio } = req.body;
  const username = req.user;

  const query = `UPDATE users SET bio = '${bio}' WHERE username = '${username}'`;

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Profile updated successfully', bio });
  });
});

app.get('/api/me', requireAuth, (req, res) => {
  const username = req.user;
  const query = `SELECT id, username, bio FROM users WHERE username = '${username}'`;

  db.query(query, (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: results[0] });
  });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('session_user');
  res.json({ message: 'Logged out successfully' });
});

app.listen(port, () => {
  console.log(`Vulnerable App backend listening at http://localhost:${port}`);
});
