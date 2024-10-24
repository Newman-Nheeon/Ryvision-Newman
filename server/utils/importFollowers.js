require('dotenv').config(); // Ensure this is at the top
const mongoose = require('mongoose');
const fs = require('fs');
const csvParser = require('csv-parser');
const path = require('path');
const Follower = require('../models/followers'); // Update this path as necessary

// Suppress the deprecation warning
mongoose.set('strictQuery', true);
const logger = require('../logger');

// Ensure your DB connection string is correctly defined in your .env file
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection error:', err));

const importFollowersFromCSV = (filePath, platform) => {
  const followers = [];
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) => followers.push({ platform, username: data.username }))
    .on('end', async () => {
      try {
        await Follower.insertMany(followers);
        logger.info(`${followers.length} followers imported successfully for ${platform}`);
      } catch (err) {
        logger.error('Failed to import followers:', err);
      }
      mongoose.disconnect();
    });
};

// Correctly specify the path to your CSV file
const filePath = path.join(__dirname, '../followers/followers.csv');
const platform = 'instagram';

importFollowersFromCSV(filePath, platform);
