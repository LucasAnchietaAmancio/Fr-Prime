const route = require("express").Router();
const UserController = require("../controllers/UserController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");


route.post("/users/create", [AuthMiddleware.isAuthenticated], UserController.createUser);
route.get("/users", [AuthMiddleware.isAuthenticated], UserController.getUserByEmail);
route.get("/users/all", [AuthMiddleware.isAuthenticated], UserController.getAllUsers);
route.put("/users/:email", [AuthMiddleware.isAuthenticated], UserController.updateUser);
route.post("/users/create/token", UserController.createToken);
route.delete("/users/:id", [AuthMiddleware.isAuthenticated], UserController.deleteUser);

module.exports = route;