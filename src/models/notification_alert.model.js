const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const notificationAlertSchema = mongoose.Schema(
  {
    
    alert: {
        type: mongoose.SchemaTypes.Mixed,
        // ref: 'Alert',
        required: true
    },

    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
      },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
notificationAlertSchema.plugin(toJSON);
notificationAlertSchema.plugin(paginate);


/**
 * @typedef NotificationAlert
 */
const NotificationAlert = mongoose.model('NotificationAlert', notificationAlertSchema);

module.exports = NotificationAlert;
