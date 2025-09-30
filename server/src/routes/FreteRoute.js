const route = require('express').Router();
const FreteController = require('../controllers/FreteController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');

route.post('/frete/create',[AuthMiddleware.isAuthenticated], FreteController.createFrete);
route.get('/frete/:id',[AuthMiddleware.isAuthenticated], FreteController.getFrete);
route.get('/fretes',[AuthMiddleware.isAuthenticated], FreteController.getAllFretes);
route.post('/fretes/message',[AuthMiddleware.isAuthenticated], FreteController.sendMessageToTruckers);

module.exports = route;

