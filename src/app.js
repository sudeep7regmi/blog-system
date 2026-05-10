const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

module.exports = app; 