const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');

const verifyCallback = (req, resolve, reject, requiredRights) => {
  if (!req.isAuthenticated()) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  // req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(req.user.role);
    let hasRequiredRights = false;
    requiredRights.forEach((requiredRight) => {
      if(userRights.includes(requiredRight)){
        hasRequiredRights = true;
      }});
    if (!hasRequiredRights) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      verifyCallback(req,resolve,reject,requiredRights)(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
