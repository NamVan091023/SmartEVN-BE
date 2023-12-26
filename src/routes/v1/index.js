const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const pollutionRoute = require('./pollution.route');
const addressRouter = require('./address.route');
const notificationRouter = require('./notification.route');
const fcmTokenRouter = require('./fcm_token.route');
const newsRouter = require('./news.route');
const areaRouter = require('./area_forest.route');
const alertRoute = require('./alert.route');
const docsRoute = require('./docs.route');
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
    path: '/pollutions',
    route: pollutionRoute
  },
  {
    path: '/address',
    route: addressRouter
  },
  {
    path: '/notification',
    route: notificationRouter
  },
  {
    path: '/fcm-token',
    route: fcmTokenRouter
  },
  {
    path: '/news',
    route: newsRouter
  },
  {
    path: '/iqair',
    route: areaRouter
  },
  {
    path: '/alert',
    route: alertRoute
  }
  
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
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
