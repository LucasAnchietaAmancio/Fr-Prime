const route = require('express').Router()
const LoginController = require('../controllers/LoginController')
const PrivateRouteController = require('../controllers/PrivateRouteController')


route.get('/private-route', PrivateRouteController.accessPrivateRoute)
route.post('/signin',LoginController.Signin)
route.post('/signup',LoginController.Signin)
route.get('/logout',LoginController.Logout)

module.exports = route