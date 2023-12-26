const httpStatus = require('http-status');
const { AreaForest } = require('../models');
const ApiError = require('../utils/ApiError');
const rp = require("request-promise");
const cheerio = require("cheerio");
 
/**
 * Create a notification
 * @param {Object} notification
 * @returns {Promise<Notification>}
 */
const getAreaForest = async (filter, options) => {
  var data = await AreaForest.find();
  return data;
};

const getIQAir = async() => {
    var uri = "https://www.iqair.com/vi/vietnam";
    try {
        const options = {
            uri: uri,
            transform: function (body) {
                return cheerio.load(body);
            },
        };
        var $ = await rp(options);
    } catch (error) {
        return error;
    }
    const tableContent = $(".ranking table");
    let data = [];
    for (let i = 0; i < tableContent.length; i++) {
        let type = $(tableContent[i]);
        // Nội dung xếp hạng.
        let title = type.attr("title").replace("<br />", "");
        
        //Tìm tên tỉnh và điểm số
        let rankData = []
        const rankName = type.find("tbody").find("a");
        const rankScore = type.find("tbody").find("p")
        for (let j = 0; j < rankName.length; j++) {
            const name = $(rankName[j]).text().trim();
            const score = $(rankScore[j]).text().trim()
            rankData.push({
                name,
                score,
            });
        }
        data.push({
            title,
            rankData,
        });
    }
    return data;
}

module.exports = {
    getAreaForest,
    getIQAir
};
