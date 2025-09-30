const route = require('express').Router();
const FretebrasController = require('../controllers/FretebrasController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const FretebrasMiddleware = require('../middlewares/FretebrasMiddleware');

route.get(
  '/session/:page/disable=:disable',
  [AuthMiddleware.isAuthenticated],
  [FretebrasMiddleware.sessionAuthMiddleware],
  FretebrasController.createSession
);

route.get(
  '/freights/:freightId/truckers',
  [AuthMiddleware.isAuthenticated], [FretebrasMiddleware.sessionAuthMiddleware],
  FretebrasController.getTruckers
);

module.exports = route;
