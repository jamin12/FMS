const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { upload } = require('../../middlewares/upload');
const { carReserveValidation } = require('../../validations');
const carreserve = require('../../controllers/car.reserve.controller');

const router = express.Router();

router
  .route('/')
  .get(carreserve.getReserveInfo)
  .post(auth('user', 'superUser', 'manageUsers'), validate(carReserveValidation.createReserve), carreserve.createCarReserve);

module.exports = router;
