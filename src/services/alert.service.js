const httpStatus = require('http-status');
const { Alert, User, NotificationAlert } = require('../models');
const ApiError = require('../utils/ApiError');
const addressService = require('./address.service');
const fcmTokenService = require('./fcm_token.service');
/**
 * Create a notification
 * @param {Object} alert
 * @returns {Promise<Alert>}
 */
const createAlert = async (alert) => {
  return Alert.create(alert);
};

const sendFCMAlert = async (alert) => {
  const tokenModels = await fcmTokenService.getAllFCMToken();
  var registrationToken = [];
  User.find({"isNotificationReceived": true}, async function(err, users) {
    for(const user of users) {
      const provinceIds = alert.provinceIds;
      const userLat = user.lat;
      const userLng = user.lng;
      const addressData = await addressService.parseAddressCoordinate(userLat, userLng);
      if(provinceIds.includes(addressData.provinceId)) {
          const noti = {
            alert: alert,
            user: user.id
          }
          NotificationAlert.create(noti);
          var token = tokenModels.filter(tok => tok.user == user.id).map(x => x.token);
          registrationToken.push(...token);
      }
    }; 

  fcmTokenService.sendFCMAlert(registrationToken, alert);
  });
}
/**
 * Query for Notifications
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAlerts = async (filter, options, startDate = null, endDate = null) => {
  const alerts = await Alert.paginate(filter, options, startDate, endDate);
  return alerts;
};

const queryReceivedAlerts = async (filter, options, startDate = null, endDate = null) => {
  const alerts = await NotificationAlert.paginate(filter, options, startDate, endDate);
  return alerts;
};

const removeAllAlerts = async(userId) => {
    await Alert.deleteMany({"userCreated": userId});
};
const deleteAlertById = async (id) => {
    const alert = await Alert.findById(id);;
    if (!alert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Thông báo không tồn tại');
    }
    await alert.remove();
    return alert;
  };

const removeAllAlertNotifications = async(userId) => {
    await NotificationAlert.deleteMany({"user": userId});
};
const deleteAlertNotificationById = async (notificationId) => {
    const notification = await NotificationAlert.findById(notificationId);;
    if (!notification) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Thông báo không tồn tại');
    }
    await notification.remove();
    return notification;
  };
module.exports = {
    createAlert,
    sendFCMAlert,
    queryAlerts,
    removeAllAlerts,
    deleteAlertById,
    queryReceivedAlerts,
    removeAllAlertNotifications,
    deleteAlertNotificationById
};
