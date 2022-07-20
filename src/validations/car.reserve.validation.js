const Joi = require('joi');
const { carId, objectId, datetime } = require('./custom.validation');

const createReserve = {
  body: Joi.object().keys({
    car_no: Joi.string().required(),
    start_reserve: Joi.custom(datetime).required(),
    end_reserve: Joi.custom(datetime).required(),
  }),
};

module.exports = {
  createReserve,
};
