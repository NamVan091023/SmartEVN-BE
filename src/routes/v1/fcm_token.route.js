const express = require('express');
const fcmTokenController = require('../../controllers/fcmToken.controler');
const validate = require('../../middlewares/validate');
const fcmTokenValidation = require('../../validations/fcm_token.validation');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(fcmTokenController.sendPollutionFCM)
  .post(auth(), validate(fcmTokenValidation.createFCMToken), fcmTokenController.createFcmToken);

module.exports = router;