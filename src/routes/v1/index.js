const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const helloRoute = require('./hello.route');
const docsRoute = require('./docs.route');
const downloadRoute = require('./download.route');
const carRoute = require('./car.route');
const historyRoute = require('./history.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/downloads',
    route: downloadRoute,
  },
  {
    path: '/cars',
    route: carRoute,
  },
  {
    path: '/history',
    route: historyRoute,
  },
  {
    path: '/user',
    route: userRoute,
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
  {
    path: '/hello',
    route: helloRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
