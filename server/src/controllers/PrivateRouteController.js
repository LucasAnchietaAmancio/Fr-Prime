// controllers/PrivateRouteController.js
const JwtService = require('../services/JwtService');
const response = require('../utils/Response');


class PrivateRouteController {
    static async accessPrivateRoute(req, res) {

        const cookieToken = req.cookies.token;

        if (!cookieToken) return response.error(res, 'Token não fornecido', 'TOKEN_MISSING', 401);

        try {
            const decoded = await JwtService.verifyToken(cookieToken);

            if (!decoded) return response.error(res, 'Token inválido ou expirado', 'TOKEN_INVALID', 401);
            
            return response.success(res, 'Acesso autorizado a rota privada', { message: 'Você acessou uma rota privada!' }, 200);

        } catch (err) {
            console.error('PrivateRouteController.accessPrivateRoute error:', err);
            return response.error(res, 'Erro interno. Tente novamente mais tarde.', 'INTERNAL_SERVER_ERROR', 500);
        }
    }
}

module.exports = PrivateRouteController;