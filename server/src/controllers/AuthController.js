// controllers/AuthController.js
const UserModel = require('../models/UserModel');
const ValidatorService = require('../services/ValidatorService');
const JwtService = require('../services/JwtService');
const response = require('../utils/Response');
const bcrypt = require('bcrypt');

class AuthController {
  static async Signin(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) return response.error(res, 'Preencha todos os campos', 'MISSING_FIELDS', 400);

      const emailTrim = String(email).trim();
      if (!ValidatorService.isValidEmail(emailTrim) || !ValidatorService.isValidPassword(senha))
        return response.error(res, 'Email ou senha não corresponde às especificações', 'INVALID_CREDENTIALS', 400);

      const user = await UserModel.getUserByEmail(emailTrim, true);
      if (!user) return response.error(res, 'E-mail ou senha inválidos', 'INVALID_CREDENTIALS', 401);

      const match = await bcrypt.compare(senha, user.senha);
      if (!match) return response.error(res, 'E-mail ou senha inválidos', 'INVALID_CREDENTIALS', 401);

      const newToken = await JwtService.generateToken(user.id_usuario, user.email);

      res.cookie("token", `Bearer ${newToken}`, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,   // mudar para true em produção HTTPS
        maxAge: 60 * 60 * 1000
      });

      return response.success(res, 'Login realizado com sucesso', { token: newToken }, 200);

    } catch (err) {
      console.error('AuthController.Signin error:', err);
      return response.error(res, 'Erro interno. Tente novamente mais tarde.', 'INTERNAL_SERVER_ERROR', 500);
    }
  }

  static async accessPrivateRoute(req, res) {
    try {
      const cookieToken = req.cookies.token;
      if (!cookieToken) return response.error(res, 'Token não fornecido', 'TOKEN_MISSING', 401);

      const parts = cookieToken.split(' ');
      if (parts.length !== 2 || !/^Bearer$/i.test(parts[0]))
        return response.error(res, 'Formato do token inválido', 'INVALID_TOKEN_FORMAT', 401);

      const cookieTokenFormat = parts[1].trim();
      const decoded = await JwtService.verifyToken(cookieTokenFormat);
      if (!decoded) return response.error(res, 'Token inválido ou expirado', 'TOKEN_INVALID', 401);

      return response.success(res, 'Acesso autorizado a rota privada', { message: 'Você acessou uma rota privada!' }, 200);

    } catch (err) {
      console.error('PrivateRouteController.accessPrivateRoute error:', err);
      return response.error(res, 'Erro interno. Tente novamente mais tarde.', 'INTERNAL_SERVER_ERROR', 500);
    }
  }

  static async Logout(req, res) {
    try {
      res.cookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // true em produção HTTPS
      });
      return response.success(res, 'Logout realizado com sucesso', {}, 200);

    } catch (err) {
      console.error('AuthController.Logout error:', err);
      return response.error(res, 'Erro interno. Tente novamente mais tarde.', 'INTERNAL_SERVER_ERROR', 500);
    }
  }
}

module.exports = AuthController;
