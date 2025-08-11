// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const courseAddRoutes = require('./routes/courseRoutesAdd'); 
const Content = require('./routes/ContentRouter');
const reactionRoutes = require('./routes/ReactionRouter');
const questionRoutes = require('./routes/QuestionRoutes');

dotenv.config();

const app = express();

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 5, // 5 days
    httpOnly: true,
    sameSite: 'lax',
    secure: false // Set to true only in HTTPS
  }
}));

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend origin
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/coursesAdd', courseAddRoutes);
app.use('/api/content', Content);
app.use('/api/reactions', reactionRoutes);
app.use('/api/questions', questionRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
