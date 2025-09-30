// models/FreteModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ModelFrete {

  static async createFrete(data) {
    if (!data || !data.id || !data.companyId || !data.freightCode || !data.freightType || !data.publisher || !data.product || !data.route || !data.price) {
      throw new Error("Dados inválidos para criação de frete");
    }

    console.log("Criando frete com dados:", data);

    try {
      const frete = await prisma.Frete.create({
        data: {
          id_fretebras: data.id,
          id_empresa: data.companyId,
          codigo_frete: data.freightCode,
          tipo_frete: data.freightType,
          tag: data.tag,
          id_publicador: data.publisher.id,
          produto: data.product,
          valorTotal: data.valorTotal,
          data_criacao: new Date(data.createdDate),

          rotas: {
            create: [
              {
                estado_origem: data.route.origin.state,
                cidade_origem: data.route.origin.city,
                estado_destino: data.route.destination.state,
                cidade_destino: data.route.destination.city,
              },
            ],
          },

          veiculos: {
            create: data.vehicles.map((v) => ({ nome: v })),
          },

          carrocerias: {
            create: data.bodyWorks.map((c) => ({ nome: c })),
          },

          precos: {
            create: [
              {
                valor: data.price.value,
                tipo: data.price.type,
              },
            ],
          },
        },
        include: {
          rotas: true,
          veiculos: true,
          carrocerias: true,
          precos: true,
        },
      });
    } catch (error) {
      console.error("Erro em createFrete:", error);
      throw error;
    }
  }

  static async getAllFretes() {
    return prisma.Frete.findMany({
      include: {
        rotas: true,
        veiculos: true,
        carrocerias: true,
        precos: true,
      },
    });
  }

  static async getFreteById(id) {
    if (!id) throw new Error("ID do frete é obrigatório");

    return prisma.Frete.findUnique({
      where: { id_fretebras: id },
      include: {
        rotas: true,
        veiculos: true,
        carrocerias: true,
        precos: true,
        publicador: true
      }
    });
  }
}

module.exports = ModelFrete;