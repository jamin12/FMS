const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const fileValidation = require('../../validations/file.validation');
const downloadController = require('../../controllers/download.controller');

const router = express.Router();

router
  .route('/:fid')
  .get(validate(fileValidation.downloadFile), downloadController.download);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Download
 *   description: Download file
 */

/**
 * @swagger
 * /downloads:
 *   get:
 *     summary: Download files
 *     description: download file using file id.
 *     tags: [Download]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: User name
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
