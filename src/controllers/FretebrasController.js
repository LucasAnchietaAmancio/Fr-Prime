const response = require('../utils/Response');
const FretebrasService = require('../services/FretebrasService');

class FretebrasController {
  
  static async createSession(req, res) {
      const { page } = req.params;
      const disable = req.query.disable === 'true'; // recebe via query ?disable=true ou false

      try {
          // Middleware já garantiu sessão válida
          const loads = await FretebrasService.getLoads(page, disable);
          return response.success(res, 'Sessão válida', { loads: loads.data });
      } catch (error) {
          console.error('Erro em createSession:', error);
          return response.error(res, 'Erro ao carregar fretes', 'LOAD_ERROR', 500);
      }
  }

  static async getTruckers(req, res) {
    try {
      const { freightId } = req.params;
      
      if (!freightId) {
        return response.error(res, 'freightId é obrigatório', 'MISSING_FREIGHT_ID', 400);
      }

      const truckers = await FretebrasService.getTruckers(freightId);
      return response.success(res, 'Caminhoneiros obtidos', { truckers: truckers.data });

    } catch (error) {
      console.error('Erro em getTruckers:', error);
      return response.error(res, 'Erro ao buscar caminhoneiros', 'TRUCKERS_ERROR', 500);
    }
  }
}

module.exports = FretebrasController;
