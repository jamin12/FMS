const express = require('express');
const validate = require('../../middlewares/validate');
const helloValidation = require('../../validations/hello.validation');
const helloController = require('../../controllers/hello.controller');

const router = express.Router();

router
  .route('/')
  .get(validate(helloValidation.hello), helloController.hello)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Hello
 *   description: Hello User
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Greeting to user
 *     description: Using to server health check for all users.
 *     tags: [Hello]
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
