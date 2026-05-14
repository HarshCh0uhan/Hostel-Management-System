import { User } from "../models/user.js";
import { Room } from "../models/room.js";
import { Complaint } from "../models/complaint.js";
import { Leave } from "../models/leave.js";

// GET /api/admin/dashboard — Admin: summary stats
export const getDashboardStats = async (req, res) => {
    try {
        const [totalStudents, totalRooms, occupiedRooms, pendingComplaints, pendingLeaves] =
            await Promise.all([
                User.countDocuments({ role: "user" }),
                Room.countDocuments(),
                Room.countDocuments({ status: "occupied" }),
                Complaint.countDocuments({ status: "pending" }),
                Leave.countDocuments({ status: "pending" }),
            ]);

        res.status(200).json({
            success: true,
            stats: {
                totalStudents,
                totalRooms,
                occupiedRooms,
                vacantRooms: totalRooms - occupiedRooms,
                pendingComplaints,
                pendingLeaves,
            },
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// GET /api/admin/students — Admin: list all students (search + filter)
export const getAllStudents = async (req, res) => {
    try {
        const filter = { role: "user" };
        if (req.query.search) {
            filter.$or = [
                { username: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ];
        }

        const students = await User.find(filter)
            .populate("room", "roomNumber floor status")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: students.length, students });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// GET /api/admin/students/:id — Admin: get one student's full profile
export const getStudentById = async (req, res) => {
    try {
        const student = await User.findOne({ _id: req.params.id, role: "user" }).populate("room");
        if (!student) throw new Error("Student not found");

        const [complaints, leaves] = await Promise.all([
            Complaint.find({ student: student._id }).sort({ createdAt: -1 }),
            Leave.find({ student: student._id }).sort({ createdAt: -1 }),
        ]);

        res.status(200).json({ success: true, student, complaints, leaves });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// DELETE /api/admin/students/:id — Admin: remove a student
export const deleteStudent = async (req, res) => {
    try {
        const student = await User.findOne({ _id: req.params.id, role: "user" });
        if (!student) throw new Error("Student not found");

        // Remove from room if assigned
        if (student.room) {
            await Room.findByIdAndUpdate(student.room, {
                $pull: { occupants: student._id },
            });
        }

        await student.deleteOne();
        res.status(200).json({ success: true, message: "Student removed" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};