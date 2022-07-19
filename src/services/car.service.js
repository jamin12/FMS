const httpStatus = require('http-status');
const Car = require('../models/car.model');
const ApiError = require('../utils/ApiError');
const { fileService } = require('../services');

/*******************************************************
차량 관리
******************************************************/
const createCarManage = async (carBody) => {
  if (await Car.isCarIdTaken(carBody.car_id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'CarId already taken');
  }
  if (await Car.isCarNoTaken(carBody.car_no)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'CarNo already taken');
  }

  return Car.create(carBody);
};

const getCarByIdManage = async (id) => {
  const car_id = await Car.getIdByNo(id);
  return Car.findById(car_id);
};

const queryCarsManage = async (filter, option) => {
  return Car.queryCarsManage(filter, option);
};

const updateCarById = async (car_no, updateBody) => {
  const car_id = await Car.getIdByNo(car_no);
  const prev = await Car.findById(car_id);
  if (!prev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car not found');
  }
  if (updateBody.car_no && (await Car.isCarNoTaken(updateBody.car_no))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'car_no already taken');
  }
  // const car = JSON.parse(JSON.stringify(prev));
  // Object.assign(car, updateBody);
  // console.log({ car: car });
  const car = await Car.save(prev, updateBody);
  
  return car;
};

const deleteCarById = async (car_no) => {
  const car_id = await Car.getIdByNo(car_no);
  const car = await Car.findById(car_id);
  if (!car) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car not found');
  }
  await Car.remove(car_id);
  
  return car;
};

/*******************************************************
차량 일반
******************************************************/
const getCars = async () => {
  return Car.findAll();
};

const getCarById = async (car_no) => {
  const car = await Car.findById(car_no);
  return car;
};

const updateCarStatById = async (car_id, body) => {
  return await Car.saveState(car_id, body);
};

module.exports = {
  createCarManage,
  queryCarsManage,
  getCarByIdManage,
  getCars,
  updateCarById,
  getCarById,
  deleteCarById,
  updateCarStatById,
};
