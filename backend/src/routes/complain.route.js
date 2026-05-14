import express from "express";
import {
    createComplaint,
    getMyComplaints,
    getAllComplaints,
    updateComplaintStatus,
    deleteComplaint,
} from "../controllers/complain.controller.js";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";

const complaintRouter = express.Router();

complaintRouter.use(authenticate);

// Student routes
complaintRouter.post("/", createComplaint);
complaintRouter.get("/my", getMyComplaints);
complaintRouter.delete("/:id", deleteComplaint);

// Admin routes
complaintRouter.get("/", authorizeAdmin, getAllComplaints);
complaintRouter.put("/:id/status", authorizeAdmin, updateComplaintStatus);

export default complaintRouter;