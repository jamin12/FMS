const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { upload } = require('../../middlewares/upload');
const { carReserveValidation } = require('../../validations');
const carreserve = require('../../controllers/car.reserve.controller');

const router = express.Router();

router
  .route('/')
  .get(auth('user'), carreserve.getReserveInfo)
  .post(auth('user'), validate(carReserveValidation.createReserve), carreserve.createReserve);

router
  .route('/myreserve')
  .get(auth('user'), carreserve.getMyReserveInfo);

router
  .route('/:reserve_id')
  .patch(auth('user'), validate(carReserveValidation.updateReserve), carreserve.updateReserve)
  .delete(auth('user'), validate(carReserveValidation.deleteReserve), carreserve.deleteReserve);

module.exports = router;
