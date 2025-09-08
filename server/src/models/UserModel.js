// models/UserModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ModelUser {
  static async createUser(data) {
    if (!data || !data.email || !data.senha || !data.nome) {
      throw new Error("Dados inválidos para criação de usuário");
    }
    // Retorna o usuário criado (Prisma) - inclui senha por padrão, então selecionamos explicitamente
    return prisma.Usuario.create({
      data,
      select: {
        id: true,
        nome: true,
        email: true
        // não incluir senha aqui intencionalmente
      }
    });
  }

  // Busca usuário por e-mail.
  // includePassword: quando true, retorna também o campo senha (para autenticação)
  static async getUserByEmail(email, includePassword = false) {
    if (!email) {
      throw new Error("Email é obrigatório para consulta");
    }

    const baseSelect = {
      id: true,
      nome: true,
      email: true
    };

    if (includePassword) baseSelect.senha = true;

    return prisma.Usuario.findUnique({
      where: { email },
      select: baseSelect
    });
  }
}

module.exports = ModelUser;
