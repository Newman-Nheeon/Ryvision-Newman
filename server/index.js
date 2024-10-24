// packages
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const logger = require('./logger');
const Admin = require('./models/admin');
const { saveToCSV } = require('./utils/csv');
const { 
  scrapeInstagramFollowers, 
  scrapeFacebookFollowers, 
  scrapeTikTokFollowers 
} = require('./utils/scraper');

// configs
const FILE_PATH = './followers/followers.csv';
const PORT = process.env.PORT || 8080;
const app = express();
dotenv.config();

// Setup Morgan to use Winston for logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// CORS configuration
const allowedOrigins = [process.env.FRONTEND_PROD_URL, 'http://localhost:3000'].filter(Boolean); // Allow production URL and localhost for development

const corsOptions = {
  origin: function (origin, callback) {
    if (origin) {
      logger.info(`[CORS] Request received from origin: ${origin}`);
    } else {
      logger.info(`[CORS] No origin provided (possible server-to-server request).`);
    }

    if (allowedOrigins.includes(origin) || !origin) {
      logger.info(`[CORS] Origin allowed: ${origin}`);
      callback(null, true); // Allow if the origin is in the allowed list or if it's a server-to-server request (no origin)
    } else {
      logger.warn(`[CORS] Origin not allowed: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Allow credentials like cookies
  optionsSuccessStatus: 200  // Legacy browsers choke on 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Imports
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const connectDB = require('./config/db_connect');

// Routes
app.get('/', (req, res) => {
  res.send('API running');
});

app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/verification-successful', (req, res) => {
  res.send("Verification successful");
});

app.get('/verified', (req, res) => {
  res.send("Already Verified");
});

app.get('/scrape', async (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).send('Username is required');
  }

  try {
    const instagramFollowers = await scrapeInstagramFollowers(username);
    const facebookFollowers = await scrapeFacebookFollowers(username);
    const tiktokFollowers = await scrapeTikTokFollowers(username);

    const followers = [...instagramFollowers, ...facebookFollowers, ...tiktokFollowers];
    await saveToCSV(followers, FILE_PATH);

    res.send('Followers saved to CSV file');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Database Connection
connectDB();

// Create default super admin if it does not exist
const createDefaultSuperAdmin = async () => {
  const defaultAdminUsername = process.env.DEFAULT_ADMIN_USERNAME;
  const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL;
  const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

  logger.info(`Default Admin Details: Username: ${defaultAdminUsername}, Email: ${defaultAdminEmail}`);

  const existingAdmin = await Admin.findOne({ username: defaultAdminUsername });
  if (!existingAdmin) {
    const superAdmin = new Admin({
      username: defaultAdminUsername,
      email: defaultAdminEmail,
      password: defaultAdminPassword,
      role: 'superadmin'
    });

    await superAdmin.save(); // The pre-save middleware will hash the password
    logger.info('Default super admin created with username: ' + defaultAdminUsername);
  } else {
    logger.info('Default super admin already exists with username: ' + defaultAdminUsername);
  }
};

mongoose.connection.on('open', async () => {
  logger.info('Connected to MongoDB');
  await createDefaultSuperAdmin();
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', err => {
  logger.error('Database connection error:', err);
});
