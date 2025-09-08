const route = require('express').Router()
const LoginController = require('../controllers/LoginController')


route.post('/signin',LoginController.Signin)


module.exports = route