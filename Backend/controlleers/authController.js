// controllers/authController.js
const bcrypt = require('bcrypt');
const db = require('../config/db');

exports.signUp = async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ message: 'Name and password are required' });
  }

  const checkUserSql = 'SELECT * FROM users WHERE name = ?';
  db.query(checkUserSql, [name], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });

    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserSql = 'INSERT INTO users (name, password) VALUES (?, ?)';
    db.query(insertUserSql, [name, hashedPassword], (err) => {
      if (err) return res.status(500).json({ message: 'Signup failed', error: err.message });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

exports.signIn = (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ message: 'Name and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE name = ?';
  db.query(sql, [name], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.user = { id: user.id, name: user.name };
    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, name: user.name },
    });
  });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};

exports.check = (req, res) => {
  if (req.session?.user) {
    return res.status(200).json({ loggedIn: true, user: req.session.user });
  }
  res.status(200).json({ loggedIn: false });
};

exports.me = (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

