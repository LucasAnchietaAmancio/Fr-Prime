const UserModel = require('../models/UserModel');
const JwtService = require('../services/JwtService');
const ValidatorService = require('../services/ValidatorService');
const response = require('../utils/Response');
const bcrypt = require('bcrypt');

class ControllerUser {
    static async createUser(req, res) {
        const data = req.body;

        if(!data.nome || !data.email || !data.senha) return response.error(res, 'Nome, email e senha são obrigatórios', 'MISSING_FIELDS', 400);

        if(!ValidatorService.isValidEmail(data.email)) return response.error(res, 'Email Informado está no formato inválido', 'INVALID_EMAIL_FORMAT', 400);

        try {

            const hashPassword = await bcrypt.hash(data.senha, 10);

            const newUser = await UserModel.createUser({
                nome: data.nome,
                email: data.email,
                senha: hashPassword // Usando 'senha'
            });

            // Omitindo dados sensíveis da resposta
            delete newUser.senha;

            return response.create(res, 'Usuário criado com sucesso');

        } catch (error) {
            console.error(error);;
            return response.error(res, 'Erro interno entre em contato com o suporte', 'INTERNAL_SERVER_ERROR', 500);
        }
    }

    static async getUserByEmail(req, res) {
        try {
            const { email } = req.body;
            console.log("Email para consulta: ", email);

            if(!email) return response.error(res, 'Email é obrigatório', 'MISSING_EMAIL', 400);

            if(ValidatorService.isValidEmail(email) === false) return response.error(res, 'Email informado está em formato inválido', 'INVALID_EMAIL_FORMAT', 400);

            const user = await UserModel.getUserByEmail(email);

            if (!user) return response.error(res, 'Usuário não encontrado', 'USER_NOT_FOUND', 404);

            return response.success(res, 'Usuário encontrado com sucesso', user, 200);

        } catch (error) {
            console.error(error);;
            return response.error(res, 'Erro interno entre em contato com o suporte', 'INTERNAL_SERVER_ERROR', 500);
        }
    }
    static async createToken(req, res) {
        try {
            const data = req.body;

            if(!data.email || !data.nome) return response.error(res, 'Email e nome são obrigatórios', 'MISSING_FIELDS', 400);

            const userExists = await UserModel.getUserByEmail(data.email);

            if(!userExists) return response.error(res, 'Usuário não encontrado', 'USER_NOT_FOUND', 404);

            const token = await JwtService.generateTokenLogin(userExists.id);

            return response.success(res," Token gerado com sucesso", { token }, 200);

        } catch (error) {
            console.error(error);
            
            return response.error(res, 'Erro interno entre em contato com o suporte', 'INTERNAL_SERVER_ERROR', 500); 
        };
    };
}

module.exports = ControllerUser;