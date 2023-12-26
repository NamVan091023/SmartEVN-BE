const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const FCMTokenSchema = mongoose.Schema(
  {
    
    token: {
        type: String,
        required: true
    },

    deviceId: {
        type: String,
        required: true,
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
FCMTokenSchema.plugin(toJSON);
FCMTokenSchema.plugin(paginate);


/**
 * @typedef FCMToken
 */
const FCMToken = mongoose.model('FCMToken', FCMTokenSchema);

module.exports = FCMToken;
