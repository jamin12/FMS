const httpStatus = require('http-status');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { fileService } = require('../services');

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (userBody.name) {
    userBody.details = {};
    userBody.details.name = userBody.name;
    delete userBody.name;
  }
  return await User.create(userBody);
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 *
 * @param {String} userId
 * @param {{password: string}} updateBody
 * {
 *   id: string,
 *   email: string,
 *   mobile: string,
 *   username: string,
 *   password: string,
 *   role: string,
 *   accept_terms: number, // YES(1), NO(0)
 *   is_email_verified: number, // YES(1), NO(0)
 *   is_mobile_verified: number,  // YES(1), NO(0)
 *   verified: string,  // last verified timestamp,
 *   details: {
 *     profile_img: number,
 *     name: string,
 *     birth: string,
 *     sex: number, // MALE(1), FEMALE(0)
 *     use_dm: number, // YES(1), NO(0)
 *     receive_mail: number, // YES(1), NO(0)
 *     receive_sms: number, // YES(1), NO(0)
 *   }
 * }
 * @returns {Promise<*>}
 */
const updateUserById = async (userId, updateBody) => {
  const prev = await getUserById(userId);
  if (!prev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (updateBody.mobile && (await User.isMobileTaken(updateBody.mobile, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mobile already taken');
  }

  const user = JSON.parse(JSON.stringify(prev));
  Object.assign(user, updateBody);

  await User.save(prev, user);

  // TODO: 프로필 이미지 변경 시 기존 파일 삭제
  // if (profile_img) {
  //   console.log({ profile_img });
  //   await fileService.deleteById(profile_img);
  // }

  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await User.remove(userId);
  if (user.details.profile_img) {
    await fileService.deleteById(user.details.profile_img);
  }
  return user;
};

const queryUsers = async (filter, options, role) => {
  return User.findAll(filter, options, role);
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
