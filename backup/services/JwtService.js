const jwt =  require('jsonwebtoken');

class ServiceJWT {
    static async generateTokenLogin(data){
        if(!data.id) throw("Dados inválidos para geração de token");

        const token = await jwt.sign({"id":data.id} , process.env.SECRET_JWT_LOGIN, {expiresIn: '1h'});

        return token;
    }

    static  verifyToken(token,SECRET){
        if(!token) throw("Token inválido");
        return  jwt.verify(token, SECRET);
    }
}

module.exports = ServiceJWT;