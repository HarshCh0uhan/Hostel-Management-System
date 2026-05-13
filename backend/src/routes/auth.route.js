import express from 'express'
import {register, registerAdmin, login, logout} from "../controllers/auth.controller.js"

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/register-admin', registerAdmin);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

export default authRouter