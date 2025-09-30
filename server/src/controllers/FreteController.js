// controllers/FreteController.js
const response = require('../utils/Response')
const ModelFrete = require('../models/FreteModel')
const MessageService = require('../services/MessageService')

class FreteController {
  static async createFrete(req, res) {
    const freteData = req.body
    if (!freteData) return response.error(res, 'Dados do frete são obrigatórios', 'MISSING_DATA', 400)

    try {
      const frete = await ModelFrete.createFrete(freteData)
      return response.success(res, 'Frete cadastrado com sucesso')
    } catch (error) {
      console.error('Erro em FreteController.createFrete:', error)
      if (error.code === 'P2002') return response.error(res, 'Já existe um frete com as mesmas informações cadastrado', 'FRETE_ALREADY_EXISTS', 409)
      return response.error(res, 'Erro ao cadastrar frete', 'FRETE_CREATE_ERROR', 500)
    }
  }

  static async getFrete(req, res) {
    const { id } = req.params
    if (!id) return response.error(res, 'ID do frete é obrigatório', 'MISSING_ID', 400)

    try {
      const frete = await ModelFrete.getFreteById(id)
      if (!frete) return response.error(res, 'Frete não encontrado', 'FRETE_NOT_FOUND', 404)
      return response.success(res, 'Frete encontrado', { frete }, 200)
    } catch (error) {
      console.error('Erro em FreteController.getFrete:', error)
      return response.error(res, 'Erro ao buscar frete', 'FRETE_FETCH_ERROR', 500)
    }
  }

  static async getAllFretes(req, res) {
    try {
      const fretes = await ModelFrete.getAllFretes()
      return response.success(res, 'Fretes recuperados com sucesso', { fretes }, 200)
    } catch (error) {
      console.error('Erro em FreteController.getAllFretes:', error)
      return response.error(res, 'Erro ao buscar fretes', 'FRETES_FETCH_ERROR', 500)
    }
  }

  static async sendMessageToTruckers(req, res) {
    const { truckerIds, freightId } = req.body
    if (!freightId || !Array.isArray(truckerIds) || truckerIds.length === 0) return response.error(res, 'freightId e truckerIds são obrigatórios', 'MISSING_DATA', 400)

    try {
      const message = await MessageService.buildMessageToFreight(freightId)
      const results = await MessageService.sendBulkMessage(message, truckerIds)
      if (results.every(r => r.status === 'failed')) return response.error(res, 'Falha ao enviar mensagem para todos os motoristas.', 'MESSAGE_SEND_ERROR', 500)
      return response.success(res, 'Mensagens processadas', { results }, 200)
    } catch (error) {
      console.error('Erro em FreteController.sendMessageToTruckers:', error)
      return response.error(res, 'Erro ao enviar mensagem', 'MESSAGE_SEND_ERROR', 500)
    }
  }
}

module.exports = FreteController
