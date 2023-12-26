const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, addressService, pollutionService, fcmTokenService, notificationService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');
const fs = require('fs');
const cloudinary = require('../middlewares/cloudinary');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  var filter;
  if (req.query['search']) {
      filter = { "name": {} };
    filter["name"]["$regex"] = new RegExp(req.query['search'], "i");       
  } else {
      filter = pick(req.query, ['name', 'role']);
  }
  
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const users = await userService.queryUsers(filter, options);
  const response = new ApiResponse(httpStatus.OK, "Lấy danh sách người dùng thành công", users);
  // console.log(response);
  res.send(response);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Người dùng không tồn tại');
  }
  const response = new ApiResponse(httpStatus.OK, "Lấy thông tin người dùng thành công", user)
  res.send(response);
});

const updateUser = catchAsync(async (req, res) => {
  const userReq = req.user;
  const body = req.body;

  if(userReq.role != "admin" && body.role != null) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền thao tác');
  }
  if(req.file){
    const uploader = async (path) => await cloudinary.uploads(path, 'Avatars');
    const file = req.file;
    const { path } = file;
    const newPath = await uploader(path)
    fs.unlinkSync(path)
    body.avatar = newPath.url;
  }
  const user = await userService.updateUserById(req.params.userId, body);
  const response = new ApiResponse(httpStatus.OK, "Cập nhật thông tin người dùng thành công", user)
  res.send(response);
});

const updateLocationByDistrict = catchAsync(async (req, res) => {

  const body = req.body;

  const lat = body.lat;
  const lng = body.lng;
  const addressData = await addressService.parseAddressCoordinate(lat, lng);

  const prevUser = await userService.getUserById(req.params.userId);
  const prevLat = prevUser.lat;
  const prevLng = prevUser.lng;
  const prevAddressData = await addressService.parseAddressCoordinate(prevLat, prevLng);
  var date = new Date();
  var sevenDayAgo = new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000));
  var fullDate = sevenDayAgo.toISOString().split('T')[0];
  
  if(addressData.districtId != prevAddressData.districtId) {
    const tokenModels = await fcmTokenService.getAllFCMToken();
    const pollution = await pollutionService.queryPollutions({districtId: addressData.districtId}, {limit: 1}, fullDate, null);
    if(pollution.results.length > 0) {
      var token = tokenModels.filter(tok => tok.user == req.params.userId).map(x => x.token);
      fcmTokenService.sendFCM(token, pollution.results[0]);
    } 
  }

  const user = await userService.updateUserById(req.params.userId, body);
  const response = new ApiResponse(httpStatus.OK, "Cập nhật thông tin người dùng thành công", user)
  res.send(response);
})

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

const updateLocation = catchAsync(async (req, res) => {

  const body = req.body;

  const lat = body.lat;
  const lng = body.lng;

  var date = new Date();
  var sevenDayAgo = new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000));
  var fullDate = sevenDayAgo.toISOString().split('T')[0];
  
  const pollutions = await pollutionService.queryPollutions({status: 1}, {limit: 1000}, fullDate, null);
  var minDistance = 10 // khoảng cách nhỏ nhất là 10km
  var minPollution = null;
  var noti = null;
  for(const pollution of pollutions.results) {
    const pLat = pollution.lat;
    const pLng = pollution.lng;
    const distance = getDistanceFromLatLonInKm(lat, lng, pLat, pLng);
    noti = await notificationService.getNotificationWithUser(pollution, req.params.userId);
    if(distance < minDistance && noti == null) {
      minDistance = distance;
      minPollution = pollution;
    }
  };

  if(minPollution != null) {
    notificationService.createNotificationWithUser(minPollution, req.params.userId);
  }

  const user = await userService.updateUserById(req.params.userId, body);
  const response = new ApiResponse(httpStatus.OK, "Cập nhật thông tin người dùng thành công", user)
  res.send(response);
})

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  const response = new ApiResponse(httpStatus.OK, "Xóa người dùng thành công")
  res.send(response);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateLocation,
};
