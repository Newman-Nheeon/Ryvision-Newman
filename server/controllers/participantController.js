const emailService = require('../utils/sendEmail');
const crypto = require('crypto');
const Participant = require('../models/participant');
const checkSocialMediaHandle = require('../utils/checkSocialMedia');
const axios = require('axios');
const logger = require('../logger');


// Submit email
exports.submitEmail = async (req, res) => {
  logger.info('Checks started');
  const { email, captcha } = req.body;
  if (!email) {
    return res.status(400).send({ message: 'Email address is required' });
  }
  if (!captcha) {
    return res.status(400).send({ message: 'Captcha is required.' });
  }
  logger.info('Checks done');
  // Google reCAPTCHA verification
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

  try {
    logger.info('Recaptcha checks');
    const captchaVerifyResponse = await axios.post(verifyUrl);
    const data = captchaVerifyResponse.data;
    logger.info('is recaptchs sucessful');
    if (!data.success) {
      return res.status(400).json({ message: "Invalid Captcha. Try again.", errors: data['error-codes'] });
    }
    logger.info('test 1');
    let participant = await Participant.findOne({ email });

    // Check if the participant has already registered and verified their email
    if (participant && participant.isEmailVerified) {
      return res.status(400).send({ message: 'Email is already verified.' });
    }
logger.info('test 2');
    // If already registered but not verified, resend the verification email
    if (participant && !participant.isEmailVerified) {
      await emailService.sendVerificationEmail(email, participant.verificationToken);
      return res.send({ message: 'Verification email resent.' });
    }
logger.info('test 3');
    // New registration
    const verificationToken = crypto.randomBytes(32).toString('hex');
    participant = new Participant({
      email,
      verificationToken,
      isEmailVerified: false,
    });
logger.info('test 4');
    await participant.save();
    await emailService.sendVerificationEmail(email, verificationToken);
    res.send({ message: 'Verification email sent.' });
    logger.info('test 5');
  } catch (error) {
    logger.info('--Error in registering Participant:', error);
    logger.error('Error in registering Participant:', error);
    res.status(500).send({ message: 'Failed to register user. ' + error });
  }
};

// Resend Verification
exports.resendVerificationToken = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: 'Email address is required' });
  }

  try {
    const participant = await Participant.findOne({ email });

    if (!participant) {
      return res.status(404).send({ message: 'Participant not found' });
    }

    if (participant.isEmailVerified) {
      return res.status(400).send({ message: 'Email is already verified.' });
    }

    // Generate a new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    participant.verificationToken = verificationToken;
    await participant.save();

    // Resend the verification email
    await emailService.sendVerificationEmail(email, verificationToken);

    res.send({ message: 'Verification email resent successfully.' });
  } catch (error) {
    logger.error('Error resending verification token:', error);
    res.status(500).send({ message: 'Failed to resend verification token. ' + error });
  }
};



exports.completeRegistration = async (req, res) => {
  const { email, firstName, lastName, stageName, socialMediaHandle, comment, termsAccepted, socialMediaPlatform, entrySocialPost } = req.body;
  const profileImagePath = req.files.profileImage ? req.files.profileImage[0].path : null;
  const entryImagePath = req.files.entryImage ? req.files.entryImage[0].path : null;

  try {
    const user = await Participant.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found.');
    }
    if (!user.isEmailVerified) {
      return res.status(400).send('Email not verified.');
    }
    if (user.isFullyRegistered) {
      return res.status(400).send('Participant is already fully registered.');
    }

    if (!firstName || !lastName || !stageName || !socialMediaHandle || !entrySocialPost || termsAccepted === undefined || !socialMediaPlatform || !profileImagePath || !entryImagePath) {
      return res.status(400).send('All fields must be filled to complete registration.');
    }

    // Check if the social media handle exists for the given platform
    const handleExists = await checkSocialMediaHandle(socialMediaHandle, socialMediaPlatform);
if (!handleExists) {
  return res.status(400).send(
    `It looks like you are not currently following us on the selected social media platform.`
  );
}


    // Proceed with updating the user's registration details
    user.firstName = firstName;
    user.lastName = lastName;
    user.stageName = stageName;
    user.socialMediaHandle = socialMediaHandle;
    user.entrySocialPost = entrySocialPost;
    user.comment = comment || "";
    user.termsAccepted = termsAccepted;
    user.socialMediaPlatform = socialMediaPlatform;
    user.profileImage = profileImagePath;
    user.entryImage = entryImagePath;
    user.isFullyRegistered = true;
    user.status = 'pending';

    await user.save();
    res.send('Registration complete. Thank you for completing your registration.');
  } catch (error) {
    logger.error('Error completing registration:', error);
    res.status(500).send('Error completing registration.');
  }
};






exports.verifyEmail = async (req, res) => {
  const FRONTEND_URL = process.env.FRONTEND_URL;
  const { token } = req.query;

  try {
    const user = await Participant.findOne({ verificationToken: token });

    if (!user) {
      return res.redirect(`${FRONTEND_URL}/verification-failed`);
    }

    user.isEmailVerified = true; 
    user.verificationToken = ''; 
    await user.save();

    // Redirect to complete registration page with email as a query parameter
    res.redirect(`${FRONTEND_URL}/complete-registration?email=${user.email}`);
  } catch (error) {
    logger.error('Error verifying email:', error);
    res.redirect(`${FRONTEND_URL}/verification-failed`);
  }
};
