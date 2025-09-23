const route = require("express").Router();
const UserController = require("../controllers/UserController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

// Criar usuário
route.post("/users/create", [AuthMiddleware.isAuthenticated], UserController.createUser);

// Buscar usuário por email
route.get("/users", [AuthMiddleware.isAuthenticated], UserController.getUserByEmail);

// Listar todos os usuários
route.get("/users/all", [AuthMiddleware.isAuthenticated], UserController.getAllUsers);

// Atualizar usuário
route.put("/users/:email", [AuthMiddleware.isAuthenticated], UserController.updateUser);

// Criar token
route.post("/users/create/token", UserController.createToken);

// Deletar usuário
route.delete("/users/:id", [AuthMiddleware.isAuthenticated], UserController.deleteUser);

module.exports = route;