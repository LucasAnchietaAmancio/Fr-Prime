const route = require('express').Router()
const AuthController = require('../controllers/AuthController')



route.get('/private-route', AuthController.accessPrivateRoute)
route.post('/signin',AuthController.Signin)
route.get('/logout',AuthController.Logout)

module.exports = route