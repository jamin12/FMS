const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, userDetailService, fileService } = require('../services');
const User = require('../models/user.model');


const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  await userDetailService.updateUserDetailsById(req.user.id, req.body);
  const user = await userService.getUserById(req.user.id);
  res.send(User.toJSON(user));
});

const updateProfile = catchAsync(async (req, res) => {
  const file = await fileService.saveFile(req);
  if (!file) {
    throw new Error();
  }
  await userDetailService.updateUserDetailsById(req.user.id, {profile_img: file.id});
  const user = await userService.getUserById(req.user.id);

  res.status(httpStatus.OK).send(User.toJSON(user));
})

module.exports = {
  getUser,
  updateUser,
  updateProfile,
};
