const Joi = require('joi');
const { objectId } = require('./custom.validation');

const downloadFile = {
  params: Joi.object().keys({
    fid: Joi.string().required().custom(objectId),
  }),
};

const uploadFile = {
  file: Joi.object()
    .keys({
      file: Joi.string()
    })
    .min(1)
}

module.exports = {
  downloadFile,
  uploadFile,
};
