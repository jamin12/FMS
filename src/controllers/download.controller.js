const httpStatus = require('http-status');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { fileService } = require('../services');

const download = catchAsync(async (req, res) => {
  const file = await fileService.getFile(req.params.id);
  if (!file) {
    throw ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  res
    .header('Content-Type', file.mimetype)
    .download(file.filepath, uuid() + file.ext);
});

module.exports = {
  download,
};
