const httpStatus = require('http-status');
const moment = require('moment');
const History = require('../models/history.model');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const { carService, fileService } = require('../services');
const { getIdByNo } = require('../models/car.model');


const addHistory = async (body) => {
  /*
  첫번째 hst 인지 구분 -> car_stat 의 onoff 와 body.onoff 비교
  IF CS.onoff = 0 AND data.onoff = 1 -> first
  ELIF CS.onoff = 1 AND data.onoff = 0 -> last
  ELSE just insert
   */
  const car_id = await getIdByNo(body.car_no);
  body.car_id = car_id;
  const car = await carService.getCarById(car_id);
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
  if (!file) {
    throw new ApiError('file not found.');
  } else {
    const { car_id, lat, lng } = req.body
    const result = await carService.updateCarStatById(car_id, { lat, lng });
    logger.debug(JSON.stringify(result));
  }
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


// trip이 시작했을 때
const startTrip = async (body) => {
  const { car_id, trip_seq, onoff, data } = body;
  const { colec_dt, lat, lng } = data;
  await carService.updateCarStatById(car_id, { onoff, lat, lng });
  return History.createTrip(car_id, trip_seq, colec_dt, lat, lng);
};

// trip이 끝났을 떄
const endTrip = async (body) => {
  const { car_id, trip_seq, onoff, data } = body;
  const { colec_dt, lat, lng } = data;
  await carService.updateCarStatById(car_id, { onoff, lat, lng });
  return History.updateTrip(car_id, trip_seq, colec_dt, lat, lng);
};

// 매 초마다 해당 자동차의 위치 변경
const saveLatestCarPosition = async (body) => {
  const { car_id, data } = body;
  const { lat, lng } = data;
  return await carService.updateCarStatById(car_id, { lat, lng });
};

const parseHHmmss = async (value) => {
  return moment(value).format('YYYYMMDD');
};

// trip_seq 리스트 가져오기
const getTripSeqList = async (car_no) =>{
  const car_id = await getIdByNo(car_no);
  return await History.getTripSeqList(car_id);
};

// 차량 trip 당 이동경로
const getPathByTrip = async (car_no, start_trip, end_trip) => { 
  if(end_trip === undefined){
    end_trip = start_trip;
  }
  const car_id = await getIdByNo(car_no);
  return await History.getPathByTrip(car_id, start_trip, end_trip);
}
module.exports = {
  addHistory,
  addDrivePoint,
  queryTrip,
  getHistory,
  getPointHistory,
  getTripSeqList,
  getPathByTrip,
};
