const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // your frontend URL, change if needed
  credentials: true                // enable sending cookies
}));
app.use(express.json());

// Session middleware setup with 10 hours expiry
app.use(session({
  name: 'session-id',
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 10,  // 10 hours in milliseconds
    httpOnly: true,
    secure: false,                // set to true if using https
    sameSite: 'lax'
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 60 * 60 * 10             // 10 hours (time to live in seconds)
  })
}));

// Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Atlas Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
