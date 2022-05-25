const Joi = require('joi');
const { carId, objectId, datetime } = require('./custom.validation');

/**
 * 운행 기록
 * @type {{body: Joi.ObjectSchema<any>}}
 */
const createHistory = {
  body: Joi.object().keys({
    car_id: Joi.string().required().custom(carId),
    trip_seq: Joi.custom(datetime).required(),
    onoff: Joi.number().min(0).max(1).required(),
    data: Joi.array().items(Joi.object().keys({
      colec_dt: Joi.custom(datetime).required(),
      lat: Joi.string().required(),
      lng: Joi.string().required()
    }))
  })
};

/**
 * 운행 지점 기록 (with 주행 파일;이미지)
 * @type {{body: Joi.ObjectSchema<any>}}
 */
const createPointHistory = {
  body: Joi.object().keys({
    car_id: Joi.string().custom(carId).required(),
    lat: Joi.string().required(),
    lng: Joi.string().required()
  })
};

/**
 * 운행 기록 조회
 * @type {{query: Joi.ObjectSchema<any>}}
 */
const getHistory = {
  query: Joi.object().keys({
    car_id: Joi.string().custom(carId).required(),
    driver_id: Joi.string().custom(objectId),
    car_no: Joi.string(),
    car_nm: Joi.string,
    trip_seq: Joi.custom(datetime).required(),
    start_dt: Joi.custom(datetime),
    end_dt: Joi.custom(datetime)
  })
};

/**
 * 운행 지점 기록 조회
 * @type {{query: Joi.ObjectSchema<any>}}
 */
const getPointHistory = {
  query: Joi.object().keys({
    car_id: Joi.string().custom(carId).required(),
    driver_id: Joi.string().custom(objectId),
    car_no: Joi.string(),
    car_nm: Joi.string,
    trip_seq: Joi.custom(datetime).required(),
    start_dt: Joi.custom(datetime),
    end_dt: Joi.custom(datetime)
  })
};

/**
 * TRIP 운행 기록 조회
 * @type {{query: Joi.ObjectSchema<any>}}
 */
const getTripHistory = {
  query: Joi.object().keys({
    car_id: Joi.string().custom(carId).required(),
    driver_id: Joi.string().custom(objectId),
    car_no: Joi.string(),
    car_nm: Joi.string,
    trip_seq: Joi.custom(datetime),
    start_dt: Joi.custom(datetime).required(),
    end_dt: Joi.custom(datetime).required()
  })
};

module.exports = {
  getHistory,
  getPointHistory,
  getTripHistory,
  createHistory,
  createPointHistory
};
