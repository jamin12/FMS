const Joi = require('joi');
const { carId, objectId } = require('./custom.validation');

/**
 * 차량 등록
 * @type {{body: Joi.ObjectSchema<any>}}
 */
const createCarManage = {
  body: Joi.object().keys({
    car_id: Joi.string().required().custom(carId),
    car_no: Joi.string(),
    car_nm: Joi.string(),
    car_model_nm: Joi.string(),
    car_color: Joi.string(),
  }),
};

const getCarsManage = {
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

const updateCarManage = {
  params: Joi.object().keys({
    car_no: Joi.string().required(),
  }),
  body: Joi.object().keys({
    car_no: Joi.string(),
    car_nm: Joi.string(),
    car_model_nm: Joi.string(),
    car_color: Joi.string(),
  }),
};

const deleteCarManage = {
  params: Joi.object().keys({
    car_no: Joi.string().required().custom(carId)
  }),
};

const getCar = {
  params: Joi.object().keys({
    car_no: Joi.string(),
  }),
};


module.exports = {
  getCar,
  // getCars,
  createCarManage,
  updateCarManage,
  deleteCarManage,
  getCarsManage,
};
