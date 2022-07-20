const Joi = require('joi');
const { carId, objectId, datetime } = require('./custom.validation');

const createReserve = {
  body: Joi.object().keys({
    car_no: Joi.string().required(),
    start_reserve: Joi.custom(datetime).required(),
    end_reserve: Joi.custom(datetime).required(),
  }),
};

const updateReserve = {
  params: Joi.object().keys({
    reserve_id: Joi.number().required(),
  }),
  body: Joi.object().keys({
    start_reserve: Joi.custom(datetime).required(),
    end_reserve: Joi.custom(datetime).required(),
  }),
};

const deleteReserve = {
  params: Joi.object().keys({
    reserve_id: Joi.number().required(),
  }),
}

module.exports = {
  createReserve,
  updateReserve,
  deleteReserve,
};
