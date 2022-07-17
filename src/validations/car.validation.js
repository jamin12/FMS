const Joi = require('joi');
const { carId, objectId } = require('./custom.validation');

/**
 * 차량 등록
 * @type {{body: Joi.ObjectSchema<any>}}
 */
const createCar = {
  body: Joi.object().keys({
    car_id: Joi.string().required().custom(carId),
    car_no: Joi.string(),
    car_nm: Joi.string(),
    car_model_nm: Joi.string(),
  }),
};

const getCar = {
  query: Joi.object().keys({
    car_id: Joi.string().required().custom(carId),
    car_no: Joi.string(),
    car_nm: Joi.string()
  })
};

const getManageCars = {
  query: Joi.object().keys({
    car_id: Joi.string(),
    car_no: Joi.string(),
    car_nm: Joi.string(),
    car_model_nm: Joi.string(),
    sortBy: Joi.string(),
    sortOption: Joi.string().valid('asc', 'desc'),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateCar = {
  query: Joi.object().keys({
    car_id: Joi.string().required().custom(carId)
  }),
  body: Joi.object().keys({
    car_no: Joi.string(),
    car_nm: Joi.string()
  })
};

const deleteCar = {
  query: Joi.object().keys({
    car_id: Joi.string().required().custom(carId)
  })
};

module.exports = {
  getCar,
  // getCars,
  createCar,
  updateCar,
  deleteCar,
  getManageCars,
};
