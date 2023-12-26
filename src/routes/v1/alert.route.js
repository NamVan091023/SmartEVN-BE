const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const alertController = require('../../controllers/alert.controller');
const alertValidation = require('../../validations/alert.validation');

const router = express.Router();

const upload = require('../../middlewares/uploadPollution');
router
  .route('/')
  .post(upload, auth(), validate(alertValidation.createAlert), alertController.createAlert)
  .get(auth(), validate(alertValidation.getAlerts), alertController.getAlert)
  .delete(auth(), alertController.deleteReceivedAlert);
router
  .route('/:id')
  .delete(auth('manageNotification'), validate(alertValidation.deleteAlert), alertController.deleteAlertNotificationById);
module.exports = router;