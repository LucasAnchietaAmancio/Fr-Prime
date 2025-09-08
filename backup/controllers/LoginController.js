const UserModel = require('../models/UserModel')
const ValidatorService = require('../services/ValidatorService')
const JwtService = require('../services/JwtService')
const response = require('../utils/Response');
const bcrypt = require('bcrypt')


class LoginController{

    static async Signin(req,res){
        const { email, senha } = req.body  
        console.log(req.body)
        
        if(!email || !senha){
           return response.error(res, 'Preencha todos os campos', 'MISSING_FIELDS', 400);
        }

        if(!ValidatorService.isValidEmail(email.trim()) || !ValidatorService.isValidPassword(senha)){
           return response.error(res, 'Email ou senha não corresponde as especificações', 'INVALID_CREDENTIALS', 400);
        }

        try{
            const user = await UserModel.getUserByEmail(email.trim())

            if(!user|| !await bcrypt.compare(senha, user.data.senha)){

                return response.error(res, 'E-mail ou senha inválidos', 'INVALID_CREDENTIALS', 401);
            }// adicionar um limite de requisição se a senha estiver incorreta

            const newToken = await JwtService.generateToken(user.data.id, process.env.SECRET_JWT_LOGIN)
            return response.success(res, 'Login realizado com sucesso', {token: newToken}, 200);
        }
        catch(err){
           return response.error(res, 'Erro interno. Tente novamente mais tarde.' + err, 'INTERNAL_SERVER_ERROR', 500);
        }
    }
}

module.exports = LoginController