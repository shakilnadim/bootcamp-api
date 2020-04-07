const express = require('express');
const dotenv = require('dotenv');

// Route files
const bootcamps = require('./routes/bootcamps');

const app = express();

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

// Load env vars
dotenv.config({ path: './config/config.env' });

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV;

app.listen(
  PORT,
  console.log(`Server running in ${MODE} mode on http://localhost:${PORT}`)
);
