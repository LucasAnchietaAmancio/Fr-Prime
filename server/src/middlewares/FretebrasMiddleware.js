const FretebrasService = require('../services/FretebrasService');

// 🔹 Sessão em memória (substituir por Redis se for produção)
let fretebrasSession = {
  tokenSession: null,
  cookieSession: null,
};

async function sessionAuthMiddleware(req, res, next) {
  try {
    let { tokenSession, cookieSession } = fretebrasSession;

    if (!tokenSession || !cookieSession) {
      console.log("🔑 Nenhuma sessão encontrada. Fazendo login...");
      const session = await FretebrasService.performLogin();

      fretebrasSession = session; // 🔹 salva na memória
      tokenSession = session.tokenSession;
      cookieSession = session.cookieSession;
    }

    // 🔹 Anexa no req para os controllers usarem
    req.session = { tokenSession, cookieSession };

    // 🔹 Valida se o token ainda está ativo
    try {
      await FretebrasService.getLoads(tokenSession, cookieSession);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("⚠️ Sessão expirada. Renovando...");
        const session = await FretebrasService.performLogin();
        fretebrasSession = session;
        req.session = session;
      } else {
        throw error;
      }
    }

    return next();
  } catch (error) {
    console.error("❌ Erro crítico no sessionAuthMiddleware:", error);
    return res.status(500).json({ error: "Erro ao validar/renovar sessão" });
  }
}

module.exports = { sessionAuthMiddleware };
