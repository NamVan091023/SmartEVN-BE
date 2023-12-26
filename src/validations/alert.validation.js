const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getAlerts = {
  query: Joi.object().keys({
    type: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    startDate: Joi.string(),
    endDate: Joi.string(),
  }),
};

const createAlert = {
    body: Joi.object().keys({
      provinceIds: Joi.array().required(),
      title: Joi.string().required(),
      content: Joi.string().required(),
    }),
  };

const deleteAlert = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
    getAlerts,
    createAlert,
    deleteAlert
};
