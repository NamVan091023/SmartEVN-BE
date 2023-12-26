const httpStatus = require('http-status');
const { PollutionQuality } = require('../config/pollutions');
const { Pollution } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a pollution
 * @param {Object} pollutionBody
 * @returns {Promise<Pollution>}
 */
const createPollution = async (pollutionBody) => {
  const qualityScore = PollutionQuality[pollutionBody.quality];
  const pollution = {
      qualityScore: qualityScore,
      status: 0, // Testing
  };
  Object.assign(pollution, pollutionBody);
  return Pollution.create(pollution);
};

/**
 * Query for Pollutions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPollutions = async (filter, options, startDate = null, endDate = null) => {
   
  const pollutions = await Pollution.paginate(filter, options, startDate, endDate);
  return pollutions;
};

/**
 * Get pollution by id
 * @param {ObjectId} id
 * @returns {Promise<Pollution>}
 */
const getPollutionById = async (id) => {
  return Pollution.findById(id);
};


/**
 * Get pollution by userID
 * @param {string} userId
 * @returns {Promise<Pollution>}
 */
const getPollutionByUserId = async (userId) => {
  return Pollution.find({ user: userId });
};

const getPollutionsByDate = async (startDate, endDate) => {
    return Pollution.find({updateAt: {
        $gte: new Date(startDate).toISOString(),
        $lt: new Date(endDate).toISOString()
    }})
}

/**
 * Update pollution by id
 * @param {ObjectId} pollutionId
 * @param {Object} updateBody
 * @returns {Promise<Pollution>}
 */
const updatePollutionById = async (pollutionId, updateBody, user) => {
  const pollution = await getPollutionById(pollutionId);
  if(user.role == "mod" && user.provinceManage.indexOf(pollution.provinceId) < 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Bạn không có quyền thao tác');
  }

  if (!pollution) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pollution not found');
  }
  Object.assign(pollution, updateBody);
  await pollution.save();
  return pollution;
};

/**
 * Delete pollution by id
 * @param {ObjectId} pollutionId
 * @returns {Promise<Pollution>}
 */
const deletePollutionById = async (pollutionId, user) => {
  const pollution = await getPollutionById(pollutionId);
  if(user.role == "mod" && user.provinceManage.indexOf(pollution.provinceId) < 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bạn không có quyền thao tác');
}
  if (!pollution) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pollution not found');
  }
  await pollution.remove();
  return pollution;
};

const getStatsPollution = async () => {
  var airCount = await Pollution.count({'type': 'air'});
  var landCount = await Pollution.count({'type': 'land'});
  var soundCount = await Pollution.count({'type': 'sound'});
  var waterCount = await Pollution.count({'type': 'water'});
  var total = airCount + landCount + soundCount + waterCount;

  // Lấy dữ liệu trong tuần
  var curr = new Date; 
  var first = curr.getDate() - curr.getDay(); 
  var last = first + 6; 

  var firstday = new Date(curr.setDate(first))
  firstday.setUTCHours(0,0,0,0);
  var lastday = new Date(curr.setDate(last))
  lastday.setUTCHours(23,59,59,999);
  var weekData = await Pollution.find({createdAt: {
    $gte: firstday.toISOString(),
    $lt: lastday.toISOString()
  }});

  return {"air": airCount, "land": landCount, "sound": soundCount, "water": waterCount, "total": total, "weekData": weekData};
}

const getHistoryPollution = async(districtId) => {
  // Lấy dữ liệu trong 30 ngày
  var first = new Date().getDate() - 30; 

  var firstday = new Date(new Date().setDate(first))
  firstday.setUTCHours(0,0,0,0);
  var lastday = new Date()
  lastday.setUTCHours(23,59,59,999);


  var data = await Pollution.find({
    createdAt: {
      $gte: firstday.toISOString(),
      $lt: lastday.toISOString()
    }, 
    districtId: districtId,
    status: 1,
  });
  return data;
}

module.exports = {
  createPollution,
  queryPollutions,
  getPollutionById,
  getPollutionByUserId,
  updatePollutionById,
  deletePollutionById,
  getPollutionsByDate,
  getStatsPollution,
  getHistoryPollution
};
