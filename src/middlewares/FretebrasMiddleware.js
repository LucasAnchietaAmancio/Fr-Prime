const FretebrasService = require('../services/FretebrasService');

async function sessionAuthMiddleware(req, res, next) {
  try {
    await FretebrasService.getSession();
    next();
  } catch (error) {
    console.error('Erro no middleware de sessão:', error);
    return res.status(500).json({ 
      error: "Erro ao validar sessão",
      code: "SESSION_ERROR"
    });
  }
}

module.exports = { sessionAuthMiddleware };