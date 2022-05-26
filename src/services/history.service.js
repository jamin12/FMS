const httpStatus = require('http-status');
const moment = require('moment');
const History = require('../models/history.model');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const { carService, fileService } = require('../services');


const addHistory = async (body) => {
  /*
  첫번째 hst 인지 구분 -> car_stat 의 onoff 와 body.onoff 비교
  IF CS.onoff = 0 AND data.onoff = 1 -> first
  ELIF CS.onoff = 1 AND data.onoff = 0 -> last
  ELSE just insert
   */
  const car = await carService.getCarById(body.car_id);
  if (!car) {
    throw new ApiError('car not found!');
  }
  logger.debug(JSON.stringify(car));
  logger.debug(JSON.stringify({ car: car.onoff, body: body.onoff }));
  if (car.onoff === 0 && body.onoff === 1) {
    const result = await startTrip(body);
    logger.debug(JSON.stringify(result));
  } else if (car.onoff === 1 && body.onoff === 0) {
    const result = await endTrip(body);
    logger.debug(JSON.stringify(result));
  } else {
    const result = await saveLatestCarPosition(body);
    logger.debug(JSON.stringify(result));
  }

  return History.createHistory(body);
};

const addDrivePoint = async (req) => {
  const parent_path = `driveHistory/${req.body.car_id}/${await parseHHmmss(req.body.colec_dt)}`;
  const file = await fileService.saveFile(req, parent_path);
  logger.debug(JSON.stringify(file));
  req.body.fid = file.fid;
  return History.createPointHistory(req.body);
};

const queryTrip = async (body) => {
  const { car_id, start_dt, end_dt } = body;
  return History.findTripHistory(car_id, start_dt, end_dt);
};

const getHistory = async (body) => {
  const { car_id, trip_seq } = body;
  return History.findHistory(car_id, trip_seq);
};

const getPointHistory = async (body) => {
  const { car_id, trip_seq } = body;
  return History.findPointHistory(car_id, trip_seq);
};

const startTrip = async (body) => {
  const { car_id, trip_seq, onoff, data } = body;
  const { colec_dt, lat, lng } = data[0];
  await carService.updateCarStatById(car_id, { onoff, lat, lng });
  return History.createTrip(car_id, trip_seq, colec_dt, lat, lng);
};

const endTrip = async (body) => {
  const { car_id, trip_seq, onoff, data } = body;
  const { colec_dt, lat, lng } = data[data.length - 1];
  await carService.updateCarStatById(car_id, { onoff, lat, lng });
  return History.updateTrip(car_id, trip_seq, colec_dt, lat, lng);
};

const saveLatestCarPosition = async (body) => {
  const { car_id, data } = body;
  const { colec_dt, lat, lng } = data[data.length - 1];
  // TODO car status 에 colec_dt 추가
  return  carService.updateCarStatById(car_id, { lat, lng });
};

const parseHHmmss = async (value) => {
  return moment(value).format('YYYYMMDD');
};

module.exports = {
  addHistory,
  addDrivePoint,
  queryTrip,
  getHistory,
  getPointHistory
};
