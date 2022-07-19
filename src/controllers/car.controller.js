const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const { carService } = require('../services');

/*******************************************************
차량 관리
******************************************************/

const createCarManage = catchAsync(async (req, res) => {
  const car = await carService.createCarManage(req.body);
  res.status(httpStatus.CREATED).send(car);
});

const getCarsManage = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['car_id', 'car_no', 'car_nm', 'car_model_nm']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await carService.queryCarsManage(filter, options);
  res.send({ result });
});

const getCarManage = catchAsync(async (req, res) => {
  const car = await carService.getCarByIdManage(req.params.car_no);
  if (!car) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send({ car });
});

const updateCarManage = catchAsync(async (req, res) => {
  const car = await carService.updateCarById(req.params.car_no, req.body);
  res.send({ car });
});

const deleteCarManage = catchAsync(async (req, res) => {
  const deleted_car = await carService.deleteCarById(req.params.car_no);
  res.status(httpStatus.NO_CONTENT).send(deleted_car);
});


/*******************************************************
차량 일반
******************************************************/
const getCars = catchAsync(async (req, res) => {
  const cars = await carService.getCars();
  res.send({cars})
});

const updateCarStateByNo = catchAsync(async (req, res) => {
  const updated_car_state = await carService.updateCarStatByNo(req.params.car_no, req.body);
  res.send({ updated_car_state });
});

module.exports = {
  createCarManage,
  // getCars,
  getCarManage,
  updateCarManage,
  deleteCarManage,
  getCarsManage,
  getCars,
  updateCarStateByNo,
};
