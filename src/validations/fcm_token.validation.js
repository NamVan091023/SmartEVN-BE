const Joi = require('joi');

const createFCMToken = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    deviceId: Joi.string().required(),
  }),
};




module.exports = {
    createFCMToken,
};
