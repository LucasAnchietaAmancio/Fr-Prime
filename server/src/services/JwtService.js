// services/JwtService.js
const jwt = require('jsonwebtoken');

class ServiceJWT {

  static async generateToken(userId) {
    if (!userId) throw new Error("userId é obrigatório para geração do token");

    const secret = process.env.SECRET_JWT_LOGIN;
    if (!secret) throw new Error("SECRET_JWT_LOGIN não configurado");

    return new Promise((resolve, reject) => {
      jwt.sign({ id: userId }, secret, { expiresIn: '2h' }, (err, token) => {
        if (err) return reject(err);
        resolve(token);
      });
    });
  }


  static async verifyToken(token) {
    if (!token) throw new Error("Token inválido");

    const secret = process.env.SECRET_JWT_LOGIN;
    if (!secret) throw new Error("SECRET_JWT_LOGIN não configurado");

    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    });
  }
}

module.exports = ServiceJWT;
