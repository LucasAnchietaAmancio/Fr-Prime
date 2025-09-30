const ModelFrete = require('../models/FreteModel');
const FretebrasService = require('../services/FretebrasService');
const twilio = require('twilio');
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioWhatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const phoneMy = process.env.PHONE_MY;
class MessageService {
  
  static async buildMessageToFreight(freightId) {
    try {
      const infoFrete = await ModelFrete.getFreteById(freightId);
      if (!infoFrete) {
        throw new Error('Frete não encontrado');
      }

      const primeiraRota = infoFrete.rotas?.[0];
      const origem = `${primeiraRota?.cidade_origem || '-'} / ${primeiraRota?.estado_origem || '-'}`;
      const destino = `${primeiraRota?.cidade_destino || '-'} / ${primeiraRota?.estado_destino || '-'}`;
      const veiculo = infoFrete.veiculos?.join(' + ') || 'Não informado';
      const carroceria = infoFrete.carrocerias?.join(' + ') || 'Não informado';
      const preco = infoFrete.precos?.[0]?.valor || 'Não informado';
      const tipoPreco = infoFrete.precos?.[0]?.tipo || '';
      const detalhesLink = `https://fretebras.com.br/${infoFrete.tag}` || 'Não informado';

      return `
        CARGAS RS LOG
        Olá, tudo bem?
        Nova oportunidade de frete disponível:
        📍 Origem: ${origem}
        📍 Destino: ${destino}
        🚚 Veículo: ${veiculo}
        🚛 Carroceria: ${carroceria}
        📦 Produto: ${infoFrete.product || 'Não informado'}
        💰 Preço: R$ ${preco}/${tipoPreco}
        🔗 Detalhes: ${detalhesLink}

        Se tiver interesse, podemos alinhar os próximos passos.
        `.trim();

    } catch (error) {
      console.error('Erro ao construir mensagem:', error);
      throw new Error('Erro ao construir mensagem');
    }
  }

  static async sendBulkMessage(message, truckerIds) {
    const results = await Promise.all(
      truckerIds.map(async (id) => {
        try {
          const phoneResponse = await FretebrasService.getPhoneTrucker(id);
          const phoneNumber = phoneResponse?.data?.phones?.[0]?.number;

          if (!phoneNumber) {
            return { status: 'failed', truckerId: id, error: 'Sem telefone' };
          }

          const resp = await this.sendWhatsAppMessage(message, phoneNumber);
          return { status: 'success', truckerId: id, phoneNumber, sid: resp.sid };
        } catch (err) {
          return { status: 'failed', truckerId: id, error: err.message };
        }
      })
    );
    return results;
  }

  static async sendWhatsAppMessage(message, phoneNumber) {

    const toPhoneNumber = `whatsapp:${phoneMy}`;
    const fromPhoneNumber = `whatsapp:${twilioWhatsappNumber}`;
    
    if (!twilioWhatsappNumber) {
      console.error('TWILIO_WHATSAPP_NUMBER não está configurado.');
      throw new Error('Número de WhatsApp da Twilio não configurado.');
    }
    
    return twilioClient.messages.create({
      from: fromPhoneNumber,
      to: toPhoneNumber,
      body: message,
    });
  }
}

module.exports = MessageService;