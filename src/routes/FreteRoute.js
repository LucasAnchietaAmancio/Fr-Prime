const route = require('express').Router()
const FreteController = require('../controllers/FreteController')
const AuthMiddleware = require('../middlewares/AuthMiddleware')

route.post('/frete/create',[AuthMiddleware.isAuthenticated], FreteController.createFrete)
route.get('/frete/:id',[AuthMiddleware.isAuthenticated], FreteController.getFrete)

module.exports = route

