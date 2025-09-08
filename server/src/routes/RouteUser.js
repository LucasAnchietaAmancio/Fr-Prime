const route = require('express').Router()
const UserController = require('../controllers/UserController')
const AuthMiddleware = require('../middlewares/AuthMiddleware')


route.get('/users',[AuthMiddleware.isAuthenticated], UserController.getUserByEmail)
route.post('/users/create',[AuthMiddleware.isAuthenticated], UserController.createUser)
route.post('/users/create/token', UserController.createToken)

module.exports = route

