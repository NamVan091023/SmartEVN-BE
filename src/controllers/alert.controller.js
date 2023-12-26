const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { alertService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');
const fcmController = require('./fcmToken.controler');
const fs = require('fs');
const cloudinary = require('../middlewares/cloudinary');
const createAlert = catchAsync(async (req, res) => {
    const uploader = async (path) => await cloudinary.uploads(path, 'Alerts');
    const urls = []
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path)
      urls.push(newPath.url)
      fs.unlinkSync(path)
    }

    const user = req.user;
    const body = req.body;
    body.images = urls;
    body["userCreated"] = user.id;
    const alert = await alertService.createAlert(body);
    alertService.sendFCMAlert(alert);
    const response = new ApiResponse(httpStatus.CREATED, "Gửi thông báo khẩn cấp thành công", alert);
    res.send(response);
});


const getAlert = catchAsync(async (req, res) => {
    var user = req.user;
    var filter = {};
    if(req.query["type"] == 'create') {
      filter = {"userCreated": user.id};
      const options = pick(req.query, ['sortBy', 'limit', 'page']);
      const result = await alertService.queryAlerts(filter, options);
      const response = new ApiResponse(httpStatus.OK, "Lấy danh sách thông báo thành công", result)
      res.send(response);
    } else {
      filter = {"user": user.id};
      const options = pick(req.query, ['sortBy', 'limit', 'page']);
      const result = await alertService.queryReceivedAlerts(filter, options);
      result.results.forEach(function(alert, index) {
        result.results[index].alert.id = result.results[index].alert._id;
        delete result.results[index].alert._id;
        delete result.results[index].alert.__v;
      });
      const response = new ApiResponse(httpStatus.OK, "Lấy danh sách thông báo thành công", result)
      res.send(response);
    }
    
  });

const deleteReceivedAlert = catchAsync(async (req, res) => {
  var user = req.user;
  await alertService.removeAllAlertNotifications(user.id);
  const response = new ApiResponse(httpStatus.OK, "Xóa tất cả thông báo thành công")
  res.send(response);
})

const deleteAlertNotificationById = catchAsync(async (req, res) => {
  await alertService.deleteAlertNotificationById(req.params.id);
  const response = new ApiResponse(httpStatus.OK, "Xóa thông báo thành công")
  res.send(response);
})

module.exports = {
    createAlert,
    getAlert,
    deleteReceivedAlert,
    deleteAlertNotificationById
};
