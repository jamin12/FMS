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
    car_nm: Joi.string()
  })
};

const getCar = {
  query: Joi.object().keys({
    car_id: Joi.string().required().custom(carId),
    car_no: Joi.string(),
    car_nm: Joi.string()
  })
};

const getCars = {
  query: Joi.object().keys({
    car_id: Joi.string().required().custom(carId),
    car_no: Joi.string(),
    car_nm: Joi.string()
  })
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
  getCars,
  createCar,
  updateCar,
  deleteCar
};
