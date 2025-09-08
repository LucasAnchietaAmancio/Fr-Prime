const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ModelUser {
    /**
     * Cria um novo usuário no banco de dados.
     * A verificação de e-mail duplicado é tratada pelo Prisma (unique constraint).
     */
    static async createUser(data) {
        // CORREÇÃO: Padronizando para 'senha'
        if (!data || !data.email || !data.senha || !data.nome) {
            // Este erro agora será genérico, pois o controller trata os casos específicos
            throw new Error("Dados inválidos para criação de usuário");
        }

        // O bloco try/catch foi removido por ser redundante.
        // Se o e-mail já existir, o Prisma lançará um erro com código 'P2002'
        // que será capturado pelo controller.
        return prisma.Usuario.create({ data });
    }

    /**
     * Busca um usuário pelo e-mail, selecionando apenas campos públicos.
     */
    static async getUserByEmail(email) {
        if (!email) {
            throw new Error("Email é obrigatório para consulta");
        }
        
        // CORREÇÃO: Validação de formato de e-mail removida do model.
        return prisma.Usuario.findUnique({
            where: { email },
            select: {
                id: true,
                nome: true,
                email: true
            }
        });
    }
  }

module.exports = ModelUser;