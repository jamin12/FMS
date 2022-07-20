const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const reserve = require('../models/car.reserve.model');
const { getIdByNo } = require('../models/car.model');

const getReserveInfo = async () => {
  return await reserve.findAllJoinCB();
};

const createCarReserve = async (body) => {
  const car_id = await getIdByNo(body.car_no);
  return await reserve.crateReserve(car_id, body);
};


module.exports = {
  createCarReserve,
  getReserveInfo,
}