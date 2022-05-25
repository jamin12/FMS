const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const hello = catchAsync(async (req, res) => {
  const name = req.query.name ? req.query.name : 'unknown';
  const message = `Hello ${name}!!`;

  res.status(httpStatus.OK).json({ message });
});

module.exports = {
  hello,
};
