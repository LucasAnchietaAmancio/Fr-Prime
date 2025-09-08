// controllers/LoginController.js
const UserModel = require('../models/UserModel');
const ValidatorService = require('../services/ValidatorService');
const JwtService = require('../services/JwtService');
const response = require('../utils/Response');
const bcrypt = require('bcrypt');

class LoginController {
  static async Signin(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return response.error(res, 'Preencha todos os campos', 'MISSING_FIELDS', 400);
      }

      const emailTrim = String(email).trim();

      if (!ValidatorService.isValidEmail(emailTrim) || !ValidatorService.isValidPassword(senha)) {
        return response.error(res, 'Email ou senha não corresponde às especificações', 'INVALID_CREDENTIALS', 400);
      }

      // Pegar senha também para comparar
      const user = await UserModel.getUserByEmail(emailTrim, true);

      // comparar de forma segura. Não retornar detalhes que diferenciem "usuário inexistente" de "senha inválida"
      if (!user) {
        // opcional: adicionar sleep curto para reduzir possibilidade de user enumeration timing
        return response.error(res, 'E-mail ou senha inválidos', 'INVALID_CREDENTIALS', 401);
      }

      const match = await bcrypt.compare(senha, user.senha);
      if (!match) {
        // aqui você pode incrementar contador de tentativas (rate limiting/bruteforce)
        return response.error(res, 'E-mail ou senha inválidos', 'INVALID_CREDENTIALS', 401);
      }

      const newToken = await JwtService.generateToken(user.id);
      return response.success(res, 'Login realizado com sucesso', { token: newToken }, 200);

    } catch (err) {
      // log interno (não expor stack para o cliente)
      console.error('LoginController.Signin error:', err);
      return response.error(res, 'Erro interno. Tente novamente mais tarde.', 'INTERNAL_SERVER_ERROR', 500);
    }
  }
}

module.exports = LoginController;
