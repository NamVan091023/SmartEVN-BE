const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');


const getNotification = catchAsync(async (req, res) => {
  var user = req.user;
  const filter = {"user": user.id};
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await notificationService.queryNotifications(filter, options);
  result.results.forEach(function(pollution, index) {
      result.results[index].pollution.id = result.results[index].pollution._id;
      delete result.results[index].pollution._id;
      delete result.results[index].pollution.__v;
    });
  const response = new ApiResponse(httpStatus.OK, "Lấy danh sách thông báo thành công", result)
  res.send(response);
});

const deleteAllNotification = catchAsync(async (req, res) => {
  var user = req.user;
  await notificationService.removeAllNotifications(user.id);
  const response = new ApiResponse(httpStatus.OK, "Xóa tất cả thông báo thành công")
  res.send(response);
});

const deleteNotificationById = catchAsync(async (req, res) => {
  await notificationService.deleteNotificationById(req.params.notificationId);
  const response = new ApiResponse(httpStatus.OK, "Xóa thông báo thành công")
  res.send(response);
})

module.exports = {
    getNotification,
    deleteAllNotification,
    deleteNotificationById
};
