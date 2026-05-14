import express from "express";
import {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    reviewLeave,
    cancelLeave,
} from "../controllers/leave.controller.js";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";

const leaveRouter = express.Router();

leaveRouter.use(authenticate);

// Student routes
leaveRouter.post("/", applyLeave);
leaveRouter.get("/my", getMyLeaves);
leaveRouter.delete("/:id", cancelLeave);

// Admin routes
leaveRouter.get("/", authorizeAdmin, getAllLeaves);
leaveRouter.put("/:id/review", authorizeAdmin, reviewLeave);

export default leaveRouter;