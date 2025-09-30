// middlewares/AuthMiddleware.js
const JwtService = require('../services/JwtService')
const response = require('../utils/Response')

async function isAuthenticated(req, res, next) {
  const authHeader = req.cookies.token
  console.log('AuthHeader:', authHeader)
  if (!authHeader) return response.error(res, 'Token não fornecido', 'TOKEN_NOT_PROVIDED', 401)

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) return response.error(res, 'Formato do token inválido', 'INVALID_TOKEN_FORMAT', 401)

  const token = parts[1].trim()

  try {
    const decoded = await JwtService.verifyToken(token)
    req.user = decoded
    return next()
  } catch (err) {
    if (err?.name === 'TokenExpiredError') return response.error(res, 'Token expirado', 'TOKEN_EXPIRED', 401)
    return response.error(res, 'Token inválido', 'INVALID_TOKEN', 401)
  }
}

module.exports = { isAuthenticated }
