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
  path: Joi.object().keys({
    car_id: Joi.string().required().custom(carId),
    car_no: Joi.string(),
    car_nm: Joi.string()
  })
};

const getCars = {
  path: Joi.object().keys({
    car_id: Joi.string().required().custom(carId),
    car_no: Joi.string(),
    car_nm: Joi.string()
  })
};

const updateCar = {
  path: Joi.object().keys({
    car_id: Joi.string().required().custom(carId)
  }),
  body: Joi.object().keys({
    car_no: Joi.string(),
    car_nm: Joi.string()
  })
};

const deleteCar = {
  path: Joi.object().keys({
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
