// services/JwtService.js
const jwt = require('jsonwebtoken');

class ServiceJWT {
  // Gera token com payload simples { id }
  static async generateToken(userId) {
    if (!userId) throw new Error("userId é obrigatório para geração do token");
    // usa secret do env internamente
    const secret = process.env.SECRET_JWT_LOGIN;
    if (!secret) throw new Error("SECRET_JWT_LOGIN não configurado");
    // retornamos uma Promise para coerência com uso async/await
    return new Promise((resolve, reject) => {
      jwt.sign({ id: userId }, secret, { expiresIn: '1h' }, (err, token) => {
        if (err) return reject(err);
        resolve(token);
      });
    });
  }

  // Verifica token e resolve com payload ou rejeita
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
