const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPollution = {
  body: Joi.object().keys({
    provinceName: Joi.string().required(),
    provinceId: Joi.string().required(),
    districtName: Joi.string().required(),
    districtId: Joi.string().required(),
    wardName: Joi.string().required(),
    wardId: Joi.string().required(),
    specialAddress: Joi.string().required(),
    type: Joi.string().required().valid('air', 'water', 'land', 'sound'),
    quality: Joi.string().required().valid('dangerous','very_bad','bad','low_quality','medium_quality','good_quality'),
    lat: Joi.number(),
    lng: Joi.number(),
    desc: Joi.string().required(),

    // qualityScore: Joi.number().required()
  }),
};

const getPollutions = {
  query: Joi.object().keys({
    provinceName: Joi.string(),
    districtName: Joi.string(),
    wardName: Joi.string(),
    provinceId: Joi.array(),
    districtId: Joi.array(),
    wardId: Joi.array(),
    type: Joi.array(),
    qualityScore: Joi.number(),
    quality: Joi.array(),
    status: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    startDate: Joi.string(),
    endDate: Joi.string(),
    search: Joi.string(),
  }),
};

const getPollutionsCurrentUser = {
  query: Joi.object().keys({
    provinceName: Joi.string(),
    districtName: Joi.string(),
    wardName: Joi.string(),
    type: Joi.array(),
    qualityScore: Joi.number(),
    quality: Joi.array(),
    status: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    startDate: Joi.string(),
    endDate: Joi.string(),
  }),
};

const getPollutionsByUser = {
  query: Joi.object().keys({
    provinceName: Joi.string(),
    districtName: Joi.string(),
    provinceId: Joi.string(),
    districtId: Joi.string(),
    wardId: Joi.string(),
    wardName: Joi.string(),
    type: Joi.array(),
    qualityScore: Joi.number(),
    quality: Joi.array(),
    status: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    startDate: Joi.string(),
    endDate: Joi.string(),
    user: Joi.string(),
  }),
};

const getPollution = {
  params: Joi.object().keys({
    pollutionId: Joi.string().custom(objectId),
  }),
};

const updatePollution = {
  params: Joi.object().keys({
    pollutionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      provinceName: Joi.string(),
      provinceId: Joi.string(),
      districtName: Joi.string(),
      districtId: Joi.string(),
      wardName: Joi.string(),
      wardId: Joi.string(),
      specialAddress: Joi.string(),
      type: Joi.string(),
      quality: Joi.string(),
      qualityScore: Joi.number(),
      lat: Joi.number(),
      lng: Joi.number(),
      desc: Joi.string(),
      status: Joi.number(),
    })
    .min(1),
};

const deletePollution = {
  params: Joi.object().keys({
    pollutionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPollution,
  getPollutions,
  getPollution,
  updatePollution,
  deletePollution,
  getPollutionsCurrentUser,
  getPollutionsByUser
};
