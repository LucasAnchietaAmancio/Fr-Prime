const response = require('../utils/Response');
const ModelFrete = require('../models/FreteModel');

class FreteController {
  // Cria um frete
  static async createFrete(req, res) {
    try {
      const freteData = req.body;

      if (!freteData) {
        return response.error(res, 'Dados do frete são obrigatórios', 'MISSING_DATA', 400);
      }

      const frete = await ModelFrete.createFrete(freteData);
      return response.success(res, 'Frete cadastrado com sucesso');

    } catch (error) {
      console.error('Erro em createFrete:', error);
      if (error.code === 'P2002') {
        return response.error(res, 'Já existe um frete com as mesmas informações cadastrado', 'FRETE_ALREADY_EXISTS', 409);
      }
      return response.error(res, 'Erro ao cadastrar frete', 'FRETE_CREATE_ERROR', 500);
    }
  }

  // Consulta frete pelo id_fretebras
  static async getFrete(req, res) {
    try {
      const { id } = req.params;
      if (!id) return response.error(res, 'ID do frete é obrigatório', 'MISSING_ID', 400);

      const frete = await ModelFrete.getFreteById(id);
      if (!frete) return response.error(res, 'Frete não encontrado', 'FRETE_NOT_FOUND', 404);

      return response.success(res, 'Frete encontrado', { frete }, 200);

    } catch (error) {
      console.error('Erro em getFrete:', error);
      return response.error(res, 'Erro ao buscar frete', 'FRETE_FETCH_ERROR', 500);
    }
  }
}

module.exports = FreteController;
