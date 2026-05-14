import express from "express";
import {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    assignStudent,
    removeStudent,
} from "../controllers/room.controller.js";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";

const roomRouter = express.Router();

roomRouter.use(authenticate);

// Admin only
roomRouter.post("/", authorizeAdmin, createRoom);
roomRouter.put("/:id", authorizeAdmin, updateRoom);
roomRouter.delete("/:id", authorizeAdmin, deleteRoom);
roomRouter.post("/:id/assign", authorizeAdmin, assignStudent);
roomRouter.post("/:id/remove", authorizeAdmin, removeStudent);

// Admin + Student can view
roomRouter.get("/", getAllRooms);
roomRouter.get("/:id", getRoomById);

export default roomRouter;