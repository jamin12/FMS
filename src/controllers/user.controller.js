const httpStatus = require('http-status');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const logger = require('../config/logger');
const { userService } = require('../services');
const myconfig = require('../config/config');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (req.user.role !== 'admin') {
    Object.assign(user, User.toJSON(user));
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const loginUser = catchAsync(async (req, res, next) => {
  await passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(httpStatus[400]).send();
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        return res.status(httpStatus[400]).send();
      }
      const token = jwt.sign({ id: user, type: 'Authorization' }, myconfig.jwt.secret);
      return res.send({ user, token });
    });
  })(req, res, next);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
};
