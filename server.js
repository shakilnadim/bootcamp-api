const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middlewares/error');

// Load env vars
dotenv.config({ path: './config/config.env' });

// connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');

const app = express();

// Body Parser
app.use(express.json());

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${MODE} mode on http://localhost:${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
