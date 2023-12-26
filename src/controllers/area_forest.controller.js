const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { areaForestService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');

const getAreaForests = catchAsync(async (req, res) => {
    filter = pick(req.query, ['country']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const areaForest = await areaForestService.getAreaForest(filter, options);
    const response = new ApiResponse(httpStatus.OK, "Lấy danh sách chỉ số thành công", areaForest);
    res.send(response);
});
const getIQAir = catchAsync(async (req, res) => {
    const iqAir = await areaForestService.getIQAir()
    const response = new ApiResponse(httpStatus.OK, "Lấy danh sách chỉ số thành công", iqAir);
    res.send(response);
})
module.exports = {
    getAreaForests,
    getIQAir
};
