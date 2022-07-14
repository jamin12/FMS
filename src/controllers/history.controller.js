const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const logger = require('../config/logger');
const { fileService, historyService } = require('../services');

const createHistory = catchAsync(async (req, res) => {
  const result = await historyService.addHistory(req.body);
  res.status(httpStatus.CREATED).send({ result });
});

const createPointHistory = catchAsync(async (req, res) => {
  const result = await historyService.addDrivePoint(req);
  res.status(httpStatus.CREATED).send({ result });
});

const queryTrip = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await historyService.queryTrip(req.query);
  res.send({ result });
});

const getHistory = catchAsync(async (req, res) => {
  const result = await historyService.getHistory(req.query);
  res.send({ result });
});

const getPointHistory = catchAsync(async (req, res) => {
  const result = await historyService.getPointHistory(req.query);
  res.send({ result });
});

module.exports = {
  createHistory,
  createPointHistory,
  queryTrip,
  getPointHistory,
  getHistory
};

