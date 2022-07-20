const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const { carReserve } = require('../services');

const getReserveInfo = catchAsync(async (req, res) => {
  const result = await carReserve.getReserveInfo();
  res.send({ result });
});

const createCarReserve = catchAsync(async (req,res) => {
  const result = await carReserve.createCarReserve(req.body);
  res.send({ result });
});

module.exports = {
  createCarReserve,
  getReserveInfo,
};