require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const reportsRouter = require('./routes/reports');

// Load env variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB using mongoose
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

const app = express();

// PUBLIC_INTERFACE
// Middleware
app.use(cors()); // Enable CORS for all origins (customize as needed)
app.use(express.json({ limit: '2mb' })); // Parse JSON bodies (increase limit for images if needed)

// Mount routes
app.use('/api/reports', reportsRouter);
// Note: upload route is handled inside reportsRouter as /api/reports/upload

// PUBLIC_INTERFACE
// Healthcheck endpoint
app.get('/', (req, res) => {
  res.send('CityFix Hub backend is running!');
});

// PUBLIC_INTERFACE
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
