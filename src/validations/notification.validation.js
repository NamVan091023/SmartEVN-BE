const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getNotifications = {
  query: Joi.object().keys({
    
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    startDate: Joi.string(),
    endDate: Joi.string(),
  }),
};

const deleteNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId),
  }),
};

module.exports = {
    getNotifications,
    deleteNotification,
};
