const { Router } = require("express");
const { signup, login, logout } = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
//userRouter.get("/profile", verifyToken, getAllUsers);
userRouter.post("/logout", verifyToken, logout);

module.exports = userRouter;
