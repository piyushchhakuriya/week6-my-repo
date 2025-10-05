const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const designRoutes = require('./routes/designRoutes');
const connectDB = require('./config/db');

const app = express();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware to parse JSON payloads
app.use(express.json({ limit: '10mb' }));

// CORS configuration
const allowedOrigins = [
  "*"     // deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman, curl
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS blocked by server"), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight OPTIONS requests
app.options("*", cors());

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend API is running 🚀' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);

// Cloudinary upload route for thumbnail images
app.post('/api/upload-thumbnail', async (req, res) => {
  try {
    const { dataUrl } = req.body;
    if (!dataUrl) return res.status(400).json({ message: "No dataUrl provided" });

    const uploadResponse = await cloudinary.uploader.upload(dataUrl, {
      folder: 'canvas-thumbnails',
    });

    res.status(200).json({ url: uploadResponse.secure_url });
  } catch (err) {
    console.error('Cloudinary upload failed:', err);
    res.status(500).json({ message: 'Cloudinary upload failed' });
  }
});

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
