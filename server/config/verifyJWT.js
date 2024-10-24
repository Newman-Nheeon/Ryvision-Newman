const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const logger = require('../logger');

const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      logger.error('Authorization header is missing');
      return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.replace('Bearer ', '');
    logger.info(`Token received: ${token}`);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info(`Token decoded: ${JSON.stringify(decoded)}`);
    const admin = await Admin.findOne({ _id: decoded.id });

    if (!admin) {
      logger.warn('Admin not found for decoded token');
      throw new Error();
    }

    req.token = token;
    req.admin = admin;
    logger.info(`Admin authenticated: ${admin.username}`);
    next();
  } catch (e) {
    logger.error('JWT verification failed:', e);
    res.status(401).json({ message: 'Please authenticate.' });
  }
};

module.exports = verifyJWT;
