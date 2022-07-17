const Joi = require('joi');
const { password, mobile } = require('./custom.validation');

const register = {
    body: Joi.object()
      .keys({
        email: Joi.string().email(),
        mobile: Joi.string().custom(mobile),
        password: Joi.string().required().custom(password),
        name: Joi.string().required()
      })
      .when(Joi.object({
        email: Joi.string()
      }).empty(), {
        then: Joi.object({ mobile: Joi.required() })
      })
      .when(Joi.object({
        mobile: Joi.string()
      }).empty(), {
        then: Joi.object({ email: Joi.required() })
      })
  }
;

const login = {
  body: Joi.object()
    .keys({
      id: Joi.string().required(),
      password: Joi.string().required(),
    })
    .min(1),
};


const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required()
  })
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required()
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password)
  })
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required()
  })
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail
};
