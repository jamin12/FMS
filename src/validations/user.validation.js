const Joi = require('joi');
const { password, objectId, mobile } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    username: Joi.string().required(),
    details: Joi.object().keys({
      name: Joi.string(),
      mobile: Joi.string().custom(mobile),
      gender: Joi.number().valid(0,1),
      memo: Joi.string()
    }),
    role: Joi.string().required().valid('user', 'admin')
  })
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId)
  })
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      username: Joi.string(),
      role: Joi.string(),
      details: Joi.object().keys({
        name: Joi.string(),
        mobile: Joi.string().custom(mobile),
        gender: Joi.number().valid(0, 1),
        memo: Joi.string(),
      }),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

const loginUser = {
  body: Joi.object()
    .keys({
      id: Joi.string().required(),
      password: Joi.string().required(),
    })
    .min(1),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
};
