const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { pollutions, pollutionsQuality } = require('../config/pollutions');

const pollutionSchema = mongoose.Schema(
  {
    
    provinceName: {
        type: String,
        trim: true
    },
    provinceId: {
        type: String, 
        trim: true
    },
    districtName: {
        type: String, 
        trim: true
    },
    districtId: {
        type: String, 
        trim: true
    },
    wardName: {
        type: String,
        trim: true
    },
    wardId: {
        type: String, 
        trim: true
    },
    specialAddress: {
        type: String, 
        trim: true
    },
    lat: {
        type: Number,
    },
    lng: {
        type: Number,
    },
    type: {
        type: String,
        required: true,
        enum: pollutions
    },
    desc: {
        type: String,
        trim: true,
    },
    images: [{
        type: String
    }],
    quality: {
        type: String,
        enum: pollutionsQuality
    },
    qualityScore: {
        type: Number,
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
      },
      status: {
          type: Number
      },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
pollutionSchema.plugin(toJSON);
pollutionSchema.plugin(paginate);


/**
 * @typedef Pollution
 */
const Pollution = mongoose.model('Pollution', pollutionSchema);

module.exports = Pollution;
