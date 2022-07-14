const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { v4: uuid } = require('uuid');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const File = require('../models/file.model');
const logger = require('../config/logger');
const config = require('../config/config');


const getExtension = async (filename) => {
  return path.parse(filename).ext;
};

const getStoragePath = async (parent_path) => {
  let dest;
  if (parent_path) {
    dest = path.join(config.storage.appRoot, config.storage.root, parent_path);
  } else {
    dest = path.join(config.storage.appRoot, config.storage.root);
  }
  if (!fs.existsSync(dest)) {
    mkdirp.sync(dest);
    // fs.mkdirSync(dest);
  }
  return dest.toString();
};

const saveFile = async (req, parent_path) => {
  const { fieldname, originalname, encoding, mimetype, destination, size } = req.file;
  const { name } = req.body;
  const temp_file = {
    path: req.file.path
  };
  const _filename = uuid();
  const file = {
    fieldname,
    originalname,
    encoding,
    mimetype,
    destination,
    filename: _filename,
    filepath: path.join(await getStoragePath(parent_path), _filename),
    size,
    ext: await getExtension(originalname)
  };

  fs.renameSync(temp_file.path, file.filepath);
  logger.debug(`Rename file:\n${temp_file.path}\n -> ${file.filepath}`);
  logger.debug(JSON.stringify(file));

  return await File.create(file);
};

const getFile = async (id) => {
  const file = await File.findById(id);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  if (!fs.existsSync(file.filepath)) {
    logger.error(
      `File not Found, ${JSON.stringify(file)}`
    );
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  return file;
};

const getFiles = async (reqBody) => {
  const files = await File.queryFiles(reqBody);
  if (!files.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  files.each(file => {
    if (!fs.existsSync(file.filepath)) {
      logger.error(
        `File not Found, ${JSON.stringify(files)}`
      );
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
  });
  return files;
};

const deleteById = async (id) => {
  const [file] = await File.remove({ id: id });
  fs.rmSync(file.filepath);
  return file;
};

module.exports = {
  saveFile,
  getFile,
  getFiles,
  deleteById
};
