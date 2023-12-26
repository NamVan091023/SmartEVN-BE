const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { newsService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');

const getNews = catchAsync(async (req, res) => {
    filter = pick(req.query, ['topic', 'tags']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const type = req.query["type"];
    const news = await newsService.getNews(filter, options, type);
    const response = new ApiResponse(httpStatus.OK, "Lấy danh sách tin tức thành công", news);
    res.send(response);
});

module.exports = {
    getNews
};
