const httpStatus = require('http-status');
const UserDetail = require('../models/user.detail.model');
const ApiError = require('../utils/ApiError');
const fileService = require('../services/file.service');


const createUserDetails = async (userDetails) => {
  return UserDetail.create(userDetails);
};

const getUserDetailsById = async (id) => {
  return UserDetail.findById(id);
};

const updateUserDetailsById = async (userId, updateBody) => {
  let details = await UserDetail.findById(userId);
  let profile_img = details.profile_img;
  if (!details) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(details, updateBody);
  await UserDetail.save(details);

  if (profile_img) {
    await fileService.deleteById(profile_img);
  }

  return details;
};

const deleteUserDetailsById = async (userId) => {
  let details = await UserDetail.findById(userId);
  if (!details) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await UserDetail.remove(userId);
  if (details.profile_img) {
    await fileService.deleteById(details.profile_img);
  }
  return details;
};

module.exports = {
  createUserDetails,
  getUserDetailsById,
  updateUserDetailsById,
  deleteUserDetailsById,
};
