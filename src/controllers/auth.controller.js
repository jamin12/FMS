const httpStatus = require('http-status');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const { authService, userService, tokenService, emailService } = require('../services');
const myconfig = require('../config/config');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user: User.toJSON(user), tokens });
});

const login = catchAsync(async (req, res, next) => {
  await passport.authenticate('local', (err, user) => {
    if (err || !user) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "login error" });
    }
    req.login(user, (error) => {
      if (error) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: "login error" });
      }else return res.send({ message: "login success" });
    });
  })(req, res, next);
});

const logout = catchAsync(async (req, res) => {
  req.session.destroy();
  res.status(httpStatus.OK).send({ message: 'logout success' });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail
};
