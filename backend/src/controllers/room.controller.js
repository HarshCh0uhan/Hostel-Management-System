import { Room } from "../models/room.js";
import { User } from "../models/user.js";

// POST /api/rooms — Admin: create a room
export const createRoom = async (req, res) => {
    try {
        const { roomNumber, floor, capacity, type, monthlyRent, amenities } = req.body;
        if (!roomNumber || !floor || !capacity || !monthlyRent)
            throw new Error("roomNumber, floor, capacity, and monthlyRent are required");

        const exists = await Room.findOne({ roomNumber });
        if (exists) throw new Error("Room number already exists");

        const room = await Room.create({ roomNumber, floor, capacity, type, monthlyRent, amenities });
        res.status(201).json({ success: true, room });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// GET /api/rooms — Admin: get all rooms (with optional status filter)
export const getAllRooms = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.type) filter.type = req.query.type;

        const rooms = await Room.find(filter).populate("occupants", "username email");
        res.status(200).json({ success: true, count: rooms.length, rooms });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// GET /api/rooms/:id — Get single room
export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate("occupants", "username email phone");
        if (!room) throw new Error("Room not found");
        res.status(200).json({ success: true, room });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// PUT /api/rooms/:id — Admin: update room details/status
export const updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!room) throw new Error("Room not found");
        res.status(200).json({ success: true, room });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// DELETE /api/rooms/:id — Admin: delete room
export const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) throw new Error("Room not found");
        if (room.occupants.length > 0)
            throw new Error("Cannot delete room with occupants. Remove students first.");

        await room.deleteOne();
        res.status(200).json({ success: true, message: "Room deleted" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// POST /api/rooms/:id/assign — Admin: assign a student to a room
export const assignStudent = async (req, res) => {
    try {
        const { studentId } = req.body;
        const room = await Room.findById(req.params.id);
        if (!room) throw new Error("Room not found");

        const student = await User.findById(studentId);
        if (!student || student.role !== "user") throw new Error("Student not found");

        if (room.occupants.length >= room.capacity)
            throw new Error("Room is at full capacity");

        if (student.room) throw new Error("Student is already assigned to a room");

        room.occupants.push(studentId);
        await room.save();

        student.room = room._id;
        await student.save();

        res.status(200).json({ success: true, message: "Student assigned to room", room });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// POST /api/rooms/:id/remove — Admin: remove a student from a room
export const removeStudent = async (req, res) => {
    try {
        const { studentId } = req.body;
        const room = await Room.findById(req.params.id);
        if (!room) throw new Error("Room not found");

        room.occupants = room.occupants.filter((id) => id.toString() !== studentId);
        await room.save();

        await User.findByIdAndUpdate(studentId, { room: null });

        res.status(200).json({ success: true, message: "Student removed from room", room });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};