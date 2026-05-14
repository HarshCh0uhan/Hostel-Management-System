import express from "express";
import { register, registerAdmin, login, logout, getMe } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/register-admin", registerAdmin);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", authenticate, getMe);

export default authRouter;