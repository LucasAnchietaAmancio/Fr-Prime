// models/UserModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ModelUser {
  static async createUser(data) {
    if (!data || !data.email || !data.senha || !data.nome || !data.cpf || !data.telefone) {
      throw new Error("Dados inválidos para criação de usuário. Nome, CPF e telefone são obrigatórios.");
    }
    
    return prisma.Usuario.create({
      data,
      select: {
        id_usuario: true,
        nome: true,
        email: true,
        cpf: true,
        telefone: true,
        role: true
      }
    });
  }

  static async getUserByEmail(email, includePassword = false) {
    if (!email) {
      throw new Error("Email é obrigatório para consulta.");
    }

    const baseSelect = {
      id_usuario: true,
      nome: true,
      email: true,
      cpf: true,
      telefone: true,
      role:true
    };

    if (includePassword) baseSelect.senha = true;

    return prisma.Usuario.findUnique({
      where: { email },
      select: baseSelect
    });
  }

  static async getUserById(id) {
    if (!id) {
      throw new Error("ID é obrigatório para consulta.");
    }
    // O id_usuario é do tipo Int, então o id também deve ser convertido
    return prisma.Usuario.findUnique({
      where: { id_usuario: parseInt(id) },
      select: {
        id_usuario: true,
        nome: true,
        email: true,
        cpf: true,
        telefone: true,
        role:true
      }
    });
  }
  
  static async deleteUser(id) {
    if (!id) throw new Error("ID é obrigatório para exclusão");

    return prisma.Usuario.delete({
      where: { id_usuario: parseInt(id) }
    });
  }

  static async updateUser(email, data) {
  if (!email || !data) {
    throw new Error("Email e dados são obrigatórios para atualização.");
  }

  return prisma.Usuario.update({
    where: { email },
    data,
    select: {
      id_usuario: true,
      nome: true,
      email: true,
      cpf: true,
      telefone: true,
      role: true
    }
  });
}

  static async listAllUsers() {
    return prisma.Usuario.findMany({
      select: {
        id_usuario: true,
        nome: true,
        email: true,
        cpf: true,
        telefone: true,
        role:true
      }
    });
  }
}

module.exports = ModelUser;