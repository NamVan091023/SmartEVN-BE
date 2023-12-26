const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const ApiResponse = require('../utils/ApiResponse');
const path = require('path');
const data = require('../utils/dvhcvn/dvhcvn.json');
const { addressService } = require('../services');

const getAddress = catchAsync(async (req, res) => {
    res.send(data);
  });
const getAddressById = catchAsync(async (req, res) => {
  const id = req.params.id;
  try {
    let rawdata = fs.readFileSync(path.join(__dirname, '../utils/dvhcvn/'+id+'.json') );
    let data = JSON.parse(rawdata);
    res.send(data);
  } catch (error) {
    throw (new ApiError(httpStatus.NOT_FOUND, "Thông tin địa chỉ không tồn tại"));
  }
})
const getAddressByCoordinate = catchAsync(async (req, res) => {
  const lat = req.query.lat;
  const lng = req.query.lng;
  // console.log(`coords: ${lat}, ${lng}`);
  const data = await addressService.parseAddressCoordinate(lat,lng);
  res.send(data)
})




  module.exports = {
    getAddress,
    getAddressById,
    getAddressByCoordinate
  };
  