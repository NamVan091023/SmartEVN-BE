const httpStatus = require('http-status');
const { Notification, User } = require('../models');
const ApiError = require('../utils/ApiError');
const addressService = require('./address.service');
const fcmTokenService = require('./fcm_token.service');
/**
 * Create a notification
 * @param {Object} notification
 * @returns {Promise<Notification>}
 */
const createNotification = async (pollution) => {
  const tokenModels = await fcmTokenService.getAllFCMToken();
  var registrationToken = [];
  User.find({"isNotificationReceived": true}, async function(err, users) {
    for(const user of users) {
      const provinceId = pollution.provinceId;
      const districtId = pollution.districtId;
      const userLat = user.lat;
      const userLng = user.lng;
      const addressData = await addressService.parseAddressCoordinate(userLat, userLng);
      if(provinceId == addressData.provinceId) {
        if(provinceId == "01" || provinceId == "79" || provinceId == "48") {
          // Thành phố HN, HCM, ĐN
          var noti = {
              user: user.id,
              pollution: pollution
          };
          var token = tokenModels.filter(tok => tok.user == user.id).map(x => x.token);
          registrationToken.push(...token);
          Notification.create(noti);
        } else {
          if(districtId == addressData.districtId) {
            var noti = {
              user: user.id,
              pollution: pollution
            };
            Notification.create(noti);
            var token = tokenModels.filter(tok => tok.user == user.id).map(x => x.token);
            registrationToken.push(...token);
          }
        }
      }
    }; 

  fcmTokenService.sendFCM(registrationToken, pollution);
  });

};

const createNotificationWithUser = async (pollution, userId) => {
  const tokenModels = await fcmTokenService.getAllFCMToken();
  var token = tokenModels.filter(tok => tok.user == userId).map(x => x.token);

  var registrationToken = [];
  User.findById(userId, async function (err, user) {
    if(user.isNotificationReceived) {
      registrationToken.push(...token);
      var noti = {
        user: user.id,
        pollution: pollution
      };
      Notification.create(noti);
      fcmTokenService.sendFCM(registrationToken, pollution);
    }
  });
};

const getNotificationWithUser = async (pollution, userId) => {
  const noti = await Notification.findOne({user: userId, pollution: pollution});
  return noti;
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
const queryNotifications = async (filter, options, startDate = null, endDate = null) => {
   
  const notifications = await Notification.paginate(filter, options, startDate, endDate);
  return notifications;
};

const removeAllNotifications = async(userId) => {
    await Notification.deleteMany({"user": userId});
};
const deleteNotificationById = async (notificationId) => {
    const notification = await Notification.findById(notificationId);;
    if (!notification) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Thông báo không tồn tại');
    }
    await notification.remove();
    return notification;
  };
module.exports = {
    createNotification,
    queryNotifications,
    removeAllNotifications,
    deleteNotificationById,
    createNotificationWithUser,
    getNotificationWithUser
};
