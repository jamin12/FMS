const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const reserve = require('../models/car.reserve.model');
const { getIdByNo } = require('../models/car.model');

const getReserveInfo = async (user_id) => {
  return await reserve.findAllJoinCB(user_id);
};

const createReserve = async (update_body) => {
  const car_id = await getIdByNo(update_body.car_no);
  delete update_body.car_no;
  return await reserve.crateReserve(car_id, update_body);
};

const updateReserve = async (reserve_id, user_id, update_body) => {
  return await reserve.updateReserve(reserve_id, user_id, update_body);
};

const deleteReserve = async (reserve_id, user_id) => {
  return await reserve.deleteReserve(reserve_id, user_id);
};

module.exports = {
  createReserve,
  getReserveInfo,
  updateReserve,
  deleteReserve,
}