const Joi = require('joi');

const hello = {
  query: Joi.object().keys({
    name: Joi.string(),
  }),
};

module.exports = {
  hello,
};
