const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const alertSchema = mongoose.Schema(
  {
    title: {
        type: String,
        trim: true,
    },
    content: {
        type: String,
        trim: true,
    },
    images: [{
        type: String
    }],
    provinceIds: [{
        type: String
    }],
    userCreated: {
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
alertSchema.plugin(toJSON);
alertSchema.plugin(paginate);


/**
 * @typedef alertSchema
 */
const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
