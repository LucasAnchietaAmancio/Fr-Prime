const JwtService = require('../services/JwtService');
const response = require('../utils/Response');

async function isAuthenticated(req,res,next){

    const authHeader = req.headers.authorization;

    if(!authHeader) return response.error(res, 'Token não fornecido', 'TOKEN_NOT_PROVIDED', 401);

    const raw = authHeader.replace('Bearer ', '').trim();
    
    try{
        const decoded = await JwtService.verifyToken(raw, process.env.SECRET_JWT_LOGIN); //aqui basicamente exige que o usuário tenha um token de login para fazer qualquer requisição a qualquer API de usuário 
        req.user = decoded;
        next();
    }
    catch(err){
        return response.error(res, 'Token inválido', 'INVALID_TOKEN', 401);
    };
};

module.exports = {
  isAuthenticated
};