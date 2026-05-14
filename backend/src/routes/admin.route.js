import express from "express";
import {
    getDashboardStats,
    getAllStudents,
    getStudentById,
    deleteStudent,
} from "../controllers/admin.controller.js";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";

const adminRouter = express.Router();

adminRouter.use(authenticate, authorizeAdmin);

adminRouter.get("/dashboard", getDashboardStats);
adminRouter.get("/students", getAllStudents);
adminRouter.get("/students/:id", getStudentById);
adminRouter.delete("/students/:id", deleteStudent);

export default adminRouter;