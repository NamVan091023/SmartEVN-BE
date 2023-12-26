const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { fcmTokenService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');
const createFcmToken = catchAsync(async (req, res) => {
    const user = req.user;
    const body = req.body;
    body["user"] = user.id;
    const token = await fcmTokenService.createFCMToken(body);
    const response = new ApiResponse(httpStatus.CREATED, "Tạo FCM Token thành công", token);
    res.send(response);
});

const sendPollutionFCM = async (pollution) => {
    const tokenModels = await fcmTokenService.getAllFCMToken();
    const registrationToken = tokenModels.map((value) => value.token);
    fcmTokenService.sendFCM(registrationToken, pollution);
};


module.exports = {
    createFcmToken,
    sendPollutionFCM
};
