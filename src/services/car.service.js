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

const getCarByNoManage = async (id) => {
  return Car.findByNoManage(id);
};

const queryCarsManage = async (filter, option) => {
  return Car.queryCarsManage(filter, option);
};

const updateCarById = async (car_no, updateBody) => {
  const prev = await getCarByNoManage(car_no);
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

const updateCarStatById = async (car_no, updateBody) => {
  const prev = await getCarByNoManage(car_no);
  if (!prev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car not found');
  }
  if (updateBody.car_id && (await Car.isCarIdTaken(updateBody.car_id, car_id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'car_id already taken');
  }
  // const car = JSON.parse(JSON.stringify(prev));
  // Object.assign(car, updateBody);
  // console.log({ car: car });
  const car = await Car.saveState(prev, updateBody);
  
  return car;
};

const deleteCarById = async (car_no) => {
  const car = await getCarByNoManage(car_no);
  if (!car) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car not found');
  }
  await Car.remove(car_no);
  
  return car;
};

/*******************************************************
차량
******************************************************/
const getCars = async () => {
  return Car.findAll();
};

module.exports = {
  createCarManage,
  queryCarsManage,
  getCarByNoManage,
  getCars,
  updateCarById,
  updateCarStatById,
  deleteCarById,
};
