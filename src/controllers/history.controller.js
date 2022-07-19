const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const logger = require('../config/logger');
const { fileService, historyService, carService } = require('../services');

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

// trip_seq 리스트 가져오기
const getTripSeqList = catchAsync(async (req, res) => {
  const result = await historyService.getTripSeqList(req.params.car_no);
  res.send({ result });
});

// 차량 리트스 가져오기
const getCars = catchAsync(async (req, res) => {
  const cars = await carService.getCars();
  let cars_pick = [];
  cars.forEach((car) => {
    cars_pick.push(pick(car, ["car_no", "car_nm", "car_model_nm"]));
  });

  res.send({ cars_pick });
});

// 차량 trip 당 이동경로
const getPathByTrip = catchAsync(async (req, res) => {
  const result = await historyService.getPathByTrip(req.params.car_no, req.params.start_trip, req.params.end_trip);
  const re = [];
  result.forEach((res, index) => {
    if (index % 10 === 0) {
      re.push(res);
    }
  });
  res.send({ re });
});

module.exports = {
  createHistory,
  createPointHistory,
  queryTrip,
  getPointHistory,
  getHistory,
  getTripSeqList,
  getCars,
  getPathByTrip,
};
