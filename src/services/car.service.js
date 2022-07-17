const httpStatus = require('http-status');
const Car = require('../models/car.model');
const ApiError = require('../utils/ApiError');
const { fileService } = require('../services');


const createCar = async (carBody) => {
  if (await Car.isCarIdTaken(carBody.car_id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'CarId already taken');
  }

  return Car.create(carBody);
};

const getCarById = async (id) => {
  return Car.findById(id);
};

const getCars = async () => {
  return Car.findAll();
};

const queryCars = async (filter, option) => {
  return Car.queryCars(filter, option);
};

const updateCarById = async (car_id, updateBody) => {
  const prev = await getCarById(car_id);
  if (!prev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car not found');
  }
  if (updateBody.car_id && (await Car.isCarIdTaken(updateBody.car_id, car_id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'car_id already taken');
  }
  // const car = JSON.parse(JSON.stringify(prev));
  // Object.assign(car, updateBody);
  // console.log({ car: car });
  const car = await Car.save(prev, updateBody);

  return car;
};

const updateCarStatById = async (car_id, updateBody) => {
  const prev = await getCarById(car_id);
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

const deleteCarById = async (car_id) => {
  const car = await getCarById(car_id);
  if (!car) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car not found');
  }
  await Car.remove(car_id);

  return car;
};

module.exports = {
  createCar,
  queryCars,
  getCarById,
  getCars,
  updateCarById,
  updateCarStatById,
  deleteCarById,
};
