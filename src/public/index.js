const express = require('express');
const templateRoute = require('./template.routes');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: templateRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
