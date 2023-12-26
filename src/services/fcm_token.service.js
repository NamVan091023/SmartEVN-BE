const httpStatus = require('http-status');
const { FCMToken } = require('../models');
const ApiError = require('../utils/ApiError');

const {FirebaseAdmin} = require('../config/firebase');
const pollutionConfig = require('../config/pollutions');
/**
 * Create a notification
 * @param {Object} token
 * @returns {Promise<FCMToken>}
 */
const createFCMToken = async (fcmBody) => {
    return FCMToken.findOneAndUpdate({deviceId: fcmBody.deviceId}, fcmBody, {upsert: true, new: true, runValidators: true},);
};
const getAllFCMToken = async () => {
    return FCMToken.aggregate([
        {
          "$lookup": {
            "from": "users",
            "localField": "user",
            "foreignField": "_id",
            "as": "usera"
          }
        },
        {
          "$match": {
            "usera.isNotificationReceived": true
          }
        }
      ]);
}
const sendFCM = async (registrationToken, pollution) => {
  if(registrationToken.length == 0) {
    return;
  }
  var imgUrl = "https://www.hungs20.xyz/ic_pin_"+pollution.type+".png";
  if(pollution.images.length > 0) imgUrl = pollution.images[0];
  
  const message = {
      data: {data: JSON.stringify(pollution)},
      notification: {
          title: "Chất lượng " + pollutionConfig.Pollutions[pollution.type] + " " + pollutionConfig.getQualityName(pollution.qualityScore),
          body: "Tại " + pollution.specialAddress + " - " + pollution.wardName + " - " + pollution.districtName + " - " + pollution.provinceName,
          imageUrl: imgUrl
        },
      android: {
        priority: "high",
        notification: {
          imageUrl: imgUrl,
          defaultSound: true,
        }
      },
      apns: {
        payload: {
          aps: {
            'mutable-content': 1
          }
        },
        fcm_options: {
          image: imgUrl
        }
      },
      webpush: {
        headers: {
          image: imgUrl
        }
      },
    tokens: registrationToken,
  };
  
  FirebaseAdmin.messaging().sendMulticast(message)
  .then((response) => {
      console.log(response.successCount + ' messages were sent successfully');
  });
}

const sendFCMAlert = async (registrationToken, alert) => {
  if(registrationToken.length == 0) {
    return;
  }
  var imgUrl = "https://www.hungs20.xyz/ic_alert.png";
  if(alert.images.length > 0) imgUrl = alert.images[0];
  
  const message = {
      data: {data: JSON.stringify(alert)},
      notification: {
          title: alert.title,
          body: alert.content,
          imageUrl: imgUrl
        },
      android: {
        priority: "high",
        notification: {
          imageUrl: imgUrl,
          defaultSound: true,
        }
      },
      apns: {
        payload: {
          aps: {
            'mutable-content': 1
          }
        },
        fcm_options: {
          image: imgUrl
        }
      },
      webpush: {
        headers: {
          image: imgUrl
        }
      },
    tokens: registrationToken,
  };
  FirebaseAdmin.messaging().sendMulticast(message)
  .then((response) => {
      console.log(response.successCount + ' messages were sent successfully');
  });
}

module.exports = {
    createFCMToken,
    getAllFCMToken,
    sendFCM,
    sendFCMAlert
};
