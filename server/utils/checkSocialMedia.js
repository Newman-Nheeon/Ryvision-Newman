const Follower = require('../models/followers'); // Adjust the path as necessary
const logger = require('../logger');

/**
 * Checks if a social media handle exists for a given platform in the database.
 * 
 * @param {String} handle - The social media handle to check.
 * @param {String} platform - The platform (e.g., "instagram", "facebook", "tiktok").
 * @returns {Promise<Boolean>} - True if the handle exists for the platform, false otherwise.
 */
const checkSocialMediaHandle = async (handle, platform) => {
  try {
    const follower = await Follower.findOne({ username: handle, platform: platform });
    return !!follower; // Returns true if a follower is found, false otherwise
  } catch (error) {
    logger.error('Error checking social media handle:', error);
    throw error; // Rethrow the error for handling upstream if necessary
  }
};

module.exports = checkSocialMediaHandle;
