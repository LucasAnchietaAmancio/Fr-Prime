const response = require('../utils/Response');
const FretebrasService = require('../services/FretebrasService');

class FretebrasController {
    static async createSession(req, res) {
        try {
            const { tokenSession, cookieSession } = req.session || {}; 
            // 🔹 Melhor usar req.session (ou middleware), em vez de req.cookies

            if (!tokenSession || !cookieSession) {
                return response.error(res, 'Nenhuma sessão ativa. Faça login novamente.', 'NO_SESSION', 401);
            }

            const loads = await FretebrasService.getLoads(tokenSession, cookieSession);

            if (loads.status !== 200) {
                console.error('FretebrasController.createSession error: Falha ao validar sessão');
                return response.error(res, 'Falha ao validar sessão', 'SESSION_VALIDATION_FAILED', 401);
            }

            return response.success(res, 'Sessão válida', { loads: loads.data }, 200);

        } catch (error) {
            console.error('FretebrasController.createSession error:', error);
            return response.error(res, 'Erro interno. Entre em contato com o suporte.', 'INTERNAL_SERVER_ERROR', 500);
        }
    }

    static async getTruckers(req, res) {
        try {
            const { freightId } = req.params;
            if (!freightId) {
                return response.error(res, 'freightId é obrigatório', 'MISSING_FREIGHT_ID', 400);
            }
            const { tokenSession, cookieSession } = req.session || {};
            if (!tokenSession || !cookieSession) {
                return response.error(res, 'Nenhuma sessão ativa. Faça login novamente.', 'NO_SESSION', 401);
            }
            const truckers = await FretebrasService.getTruckers(tokenSession, cookieSession, freightId);

            if (truckers.status !== 200) {
                console.error('FretebrasController.getTruckers error: Falha ao obter caminhoneiros');
                return response.error(res, 'Falha ao obter caminhoneiros', 'GET_TRUCKERS_FAILED', 500);
            }
            return response.success(res, 'Caminhoneiros obtidos com sucesso', { truckers: truckers.data }, 200);

        } catch (error) {
            console.error('FretebrasController.getTruckers error:', error);
            return response.error(res, 'Erro interno. Entre em contato com o suporte.', 'INTERNAL_SERVER_ERROR', 500);
        }
    }
}

module.exports = FretebrasController;
