const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { pollutionService, notificationService } = require('../services');
const { getQuality, getQualityName, Pollutions, PollutionQuality } = require('../config/pollutions');
const ApiResponse = require('../utils/ApiResponse');
const fcmController = require('./fcmToken.controler');
const fs = require('fs');
const cloudinary = require('../middlewares/cloudinary');
const createPollution = catchAsync(async (req, res) => {
    const uploader = async (path) => await cloudinary.uploads(path, 'Pollutions');
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
    body["user"] = user.id;
    const pollution = await pollutionService.createPollution(body);
    const response = new ApiResponse(httpStatus.CREATED, "Báo cáo thông tin ô nhiễm thành công", pollution);
    res.send(response);
});

const getPollutions = catchAsync(async (req, res) => {
  var filter;
  if (req.query['search']) {
      filter = { "specialAddress": {} };
    filter["specialAddress"]["$regex"] = new RegExp(req.query['search'], "i");       
  } else {
    filter = pick(req.query, ['provinceName', 'districtName', 'wardName', 'type', 'quality', 'qualityScore', 'status', 'provinceId', 'districtId', 'wardId']);
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const result = await pollutionService.queryPollutions(filter, options, startDate, endDate);
  if(result.results) {
    const pollutionsQualityScore = result.results.map(item => {
        if(item.qualityScore) return item.qualityScore;
        return 0;
    });
    var sumQualityScore = 0;
    pollutionsQualityScore.forEach(score => {
        sumQualityScore += score;
    });
    const avgQualityScore = sumQualityScore/pollutionsQualityScore.length;
    result.avgQualityScore = avgQualityScore;
    result.avgQuality = getQuality(avgQualityScore);
  }
  const response = new ApiResponse(httpStatus.OK, "Lấy danh sách ô nhiễm thành công", result)
  res.send(response);
});


const getPollution = catchAsync(async (req, res) => {
  const pollution = await pollutionService.getPollutionById(req.params.pollutionId);
  if (!pollution) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Thông tin ô nhiễm không tồn tại');
  }
  const response = new ApiResponse(httpStatus.OK, "Lấy thông tin ô nhiễm thành công", pollution)
  res.send(response);
});

const updatePollution = catchAsync(async (req, res) => {
  const user = req.user;
  const pollution = await pollutionService.updatePollutionById(req.params.pollutionId, req.body, user);
  if(req.body.status == 1) {
    notificationService.createNotification(pollution);
  }
  const response = new ApiResponse(httpStatus.OK, "Cập nhật thông tin ô nhiễm thành công", pollution)
  res.send(response);
});

const deletePollutionById = catchAsync(async (req, res) => {
  const user = req.user;
  await pollutionService.deletePollutionById(req.params.pollutionId, user);
  const response = new ApiResponse(httpStatus.OK, "Xóa thông tin ô nhiễm thành công")
  res.send(response);
});

const getTypesPollution = catchAsync(async (req, res) => {
  var data = [];
  var keys = Object.keys(Pollutions);
  keys.forEach(key => {
    data.push({"key": key, "name": Pollutions[key]});
  });
  const response = new ApiResponse(httpStatus.OK, "Lấy danh sách loại ô nhiễm thành công", data)
  res.send(response);
})

const getQualityPollution = catchAsync(async (req, res) => {
  var data = [];
  var keys = Object.keys(PollutionQuality);
  keys.forEach(key => {
    data.push({"key": key, "score": PollutionQuality[key], "name": getQualityName(PollutionQuality[key])});
  });
  const response = new ApiResponse(httpStatus.OK, "Lấy danh sách mức độ ô nhiễm thành công", data)
  res.send(response);
})

const getPollutionsCurrentUser = catchAsync(async (req, res) => {
  var user = req.user;

  const filter = pick(req.query, ['provinceName', 'districtName', 'wardName', 'type', 'quality', 'qualityScore', 'status']);
  filter['user'] = user.id;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  var result = await pollutionService.queryPollutions(filter, options, startDate, endDate);
  // result.results = result.results.filter(x => x.user == user.id);

  if(result.results) {
    const pollutionsQualityScore = result.results.map(item => {
        if(item.qualityScore) return item.qualityScore;
        return 0;
    });
    var sumQualityScore = 0;
    pollutionsQualityScore.forEach(score => {
        sumQualityScore += score;
    });
    const avgQualityScore = 1.0*sumQualityScore/pollutionsQualityScore.length;
    result.avgQualityScore = avgQualityScore;
    result.avgQuality = getQuality(avgQualityScore);
  }
  const response = new ApiResponse(httpStatus.OK, "Lấy danh sách ô nhiễm thành công", result)
  res.send(response);
})

const getStatsPollution = catchAsync(async (req, res) => {
  const data = await pollutionService.getStatsPollution();
  const response = new ApiResponse(httpStatus.OK, "Lấy báo cáo thành công", data)
  res.send(response);
})
const getHistoryPollution = catchAsync(async (req, res) => {
  const districtId = req.query["districtId"];
  const data = await pollutionService.getHistoryPollution(districtId);
  const response = new ApiResponse(httpStatus.OK, "Lấy lịch sử ô nhiễm thành công", data);
  res.send(response);
});

const getPollutionByUserId = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['provinceName', 'districtName', 'wardName', 'type', 'quality', 'qualityScore', 'status', 'user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  var result = await pollutionService.queryPollutions(filter, options, startDate, endDate);

  if(result.results) {
    const pollutionsQualityScore = result.results.map(item => {
        if(item.qualityScore) return item.qualityScore;
        return 0;
    });
    var sumQualityScore = 0;
    pollutionsQualityScore.forEach(score => {
        sumQualityScore += score;
    });
    const avgQualityScore = 1.0*sumQualityScore/pollutionsQualityScore.length;
    result.avgQualityScore = avgQualityScore;
    result.avgQuality = getQuality(avgQualityScore);
  }
  const response = new ApiResponse(httpStatus.OK, "Lấy danh sách ô nhiễm thành công", result)
  res.send(response);
})
module.exports = {
  createPollution,
  getPollutions,
  getPollution,
  updatePollution,
  deletePollutionById,
  getTypesPollution,
  getQualityPollution,
  getPollutionsCurrentUser,
  getStatsPollution,
  getHistoryPollution,
  getPollutionByUserId
};
