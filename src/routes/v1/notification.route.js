const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const notificationController = require('../../controllers/notification.controller');
const notificationValidation = require('../../validations/notification.validation');

const router = express.Router();

router
  .route('/')
  .get(auth(), validate(notificationValidation.getNotifications), notificationController.getNotification)
  .delete(auth(), notificationController.deleteAllNotification);
router
  .route('/:notificationId')
  .delete(auth('manageNotification'), validate(notificationValidation.deleteNotification), notificationController.deleteNotificationById);
module.exports = router;