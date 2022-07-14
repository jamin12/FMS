const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const helloModel = require('../models/hello.model');

const hello = catchAsync(async (req, res) => {
  const name = req.query.name ? req.query.name : 'unknown';
  const message = `Hello ${name}!!`;
  await helloModel.hello(req.body);

  res.status(httpStatus.OK).json({ message });
});

module.exports = {
  hello,
};
