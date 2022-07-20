const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const { carReserve } = require('../services');

const getReserveInfo = catchAsync(async (req, res) => {
  const result = await carReserve.getReserveInfo(req.user.id);
  res.send({ result });
});

const createReserve = catchAsync(async (req,res) => {
  if(req.user.id){
    req.body.user_id = req.user.id;
  }
  const result = await carReserve.createReserve(req.body);
  res.send({ result });
});

const updateReserve = catchAsync(async (req,res) => {
  const result = await carReserve.updateReserve(req.params.reserve_id, req.user.id, req.body);
  res.send({ result });
});

const deleteReserve = catchAsync(async (req,res) => {
  const result = await carReserve.deleteReserve(req.params.reserve_id, req.user.id);
  res.send({ result })
});

module.exports = {
  createReserve,
  getReserveInfo,
  updateReserve,
  deleteReserve,
};