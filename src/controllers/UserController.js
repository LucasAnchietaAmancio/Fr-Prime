// controllers/UserController.js
const UserModel = require('../models/UserModel');
const JwtService = require('../services/JwtService');
const ValidatorService = require('../services/ValidatorService');
const response = require('../utils/Response');
const bcrypt = require('bcrypt');

class ControllerUser {
  static async createUser(req, res) {
    const data = req.body;

    if (!data.nome || !data.email || !data.senha || !data.cpf || !data.telefone || !data.role) {
      console.log(data)
      return response.error(res, 'Nome, email, senha, CPF e telefone são obrigatórios', 'MISSING_FIELDS', 400);
    }

    if (!ValidatorService.isValidEmail(data.email)) {
      return response.error(res, 'Email informado está no formato inválido', 'INVALID_EMAIL_FORMAT', 400);
    }
    
    // Adicione validações para CPF e Telefone, se necessário
    // Ex: if (!ValidatorService.isValidCPF(data.cpf)) { ... }

    try {
      const hashPassword = await bcrypt.hash(data.senha, 10);

      const newUser = await UserModel.createUser({
        nome: data.nome,
        email: data.email,
        senha: hashPassword,
        cpf: data.cpf,
        telefone: data.telefone,
        role: data.nivel_acesso
      });

      return response.create(res, 'Usuário criado com sucesso', 201);
    } catch (error) {
      console.error('ControllerUser.createUser error:', error);
      if (error.code === 'P2002') {
        return response.error(res, 'Email ou CPF já cadastrados', 'UNIQUE_CONSTRAINT_FAILED', 409);
      }
      return response.error(res, 'Erro interno. Entre em contato com o suporte', 'INTERNAL_SERVER_ERROR', 500);
    }
  }

  static async getUserByEmail(req, res) {
    try {
      const { email } = req.body;

      if (!email) return response.error(res, 'Email é obrigatório', 'MISSING_EMAIL', 400);
      if (ValidatorService.isValidEmail(email) === false) return response.error(res, 'Email informado está em formato inválido', 'INVALID_EMAIL_FORMAT', 400);

      const user = await UserModel.getUserByEmail(email);
      if (!user) return response.error(res, 'Usuário não encontrado', 'USER_NOT_FOUND', 404);

      return response.success(res, 'Usuário encontrado com sucesso', user, 200);
    } catch (error) {
      console.error('ControllerUser.getUserByEmail error:', error);
      return response.error(res, 'Erro interno. Entre em contato com o suporte', 'INTERNAL_SERVER_ERROR', 500);
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.listAllUsers();
      return response.success(res, "Usuários listados com sucesso", users, 200);
    } catch (error) {
      console.error("ControllerUser.listAllUsers error:", error);
      return response.error(res, "Erro interno. Entre em contato com o suporte", "INTERNAL_SERVER_ERROR", 500);
    }
  }

  // Atualizar usuário
  static async updateUser(req, res) {
    try {
      const { email } = req.params;
      if (!email) {
        return response.error(res, "Email do usuário é obrigatório", "MISSING_email", 400);
      }

      const existingUser = await UserModel.getUserByEmail(email, true);
      if (!existingUser) {
        return response.error(res, "Usuário não encontrado", "NOT_FOUND", 404);
      }

      const data = req.body;
      const updates = {};

      // Campos básicos
      ["nome", "cpf", "telefone", "role"].forEach((field) => {
        if (data[field] && data[field] !== existingUser[field]) {
          updates[field] = data[field];
        }
      });

      // Redefinição de senha
      if (data.senhaAtual && data.novaSenha) {
        const senhaCorreta = await bcrypt.compare(data.senhaAtual, existingUser.senha);
        if (!senhaCorreta) {
          return response.error(res, "Senha atual incorreta", "INVALID_PASSWORD", 400);
        }

        // Criptografa a nova senha
        const hashSenha = await bcrypt.hash(data.novaSenha, 10); // 10 salt rounds
        updates.senha = hashSenha;
      }

      if (Object.keys(updates).length === 0) {
        return response.success(res, "Nenhuma alteração necessária", existingUser, 200);
      }

      const updatedUser = await UserModel.updateUser(email, updates);
      return response.success(res, "Usuário atualizado com sucesso", updatedUser, 200);

    } catch (error) {
      console.error("UserController.updateUser error:", error);
      return response.error(res, "Erro interno. Entre em contato com o suporte", "INTERNAL_SERVER_ERROR", 500);
    }
  }
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return response.error(res, "ID do usuário é obrigatório", "MISSING_ID", 400);
      }

      // Verifica se o usuário existe
      const existingUser = await UserModel.getUserById(id);
      if (!existingUser) {
        return response.error(res, "Usuário não encontrado", "NOT_FOUND", 404);
      }

      // Exclui o usuário
      await UserModel.deleteUser(id);

      return response.success(res, "Usuário excluído com sucesso", null, 200);
    } catch (error) {
      console.error("UserController.deleteUser error:", error);
      return response.error(res, "Erro interno. Entre em contato com o suporte", "INTERNAL_SERVER_ERROR", 500);
    }
  }
  static async createToken(req, res) {
    try {
      const data = req.body;
      if (!data.email || !data.nome) return response.error(res, 'Email e nome são obrigatórios', 'MISSING_FIELDS', 400);

      const userExists = await UserModel.getUserByEmail(data.email);
      console.log('User fetched from DB:', userExists);
      if (!userExists) return response.error(res, 'Usuário não encontrado', 'USER_NOT_FOUND', 404);

      const token = await JwtService.generateToken(userExists.id_usuario);
      return response.success(res, 'Token gerado com sucesso', { token }, 200);
    } catch (error) {
      console.error('ControllerUser.createToken error:', error);
      return response.error(res, 'Erro interno entre em contato com o suporte', 'INTERNAL_SERVER_ERROR', 500);
    }
  }
}

module.exports = ControllerUser;
