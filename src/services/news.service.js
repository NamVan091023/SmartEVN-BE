const httpStatus = require('http-status');
const { NewsWeb } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a notification
 * @param {Object} notification
 * @returns {Promise<Notification>}
 */
const getNews = async (filter, options, type) => {
    var news = []
    if(type == "racthai") {
        news = await NewsWeb.RacThai.paginate(filter, options);
    } else if(type == "chatthai") {
        news = await NewsWeb.ChatThai.paginate(filter, options);
    } else if(type == "nuocthai") {
        news = await NewsWeb.NuocThai.paginate(filter, options);
    } else if(type == "onhiemnuoc") {
        news = await NewsWeb.ONhiemNuoc.paginate(filter, options);
    } else if(type == "onhiemkhongkhi") {
        news = await NewsWeb.ONhiemKhongKhi.paginate(filter, options);
    } else if(type=="fb") { 
        news = await NewsWeb.FBNews.paginate(filter, options);
    }else {
        news = await NewsWeb.MoiTruong.paginate(filter, options);
    } 
  return news;
};

module.exports = {
    getNews
};
