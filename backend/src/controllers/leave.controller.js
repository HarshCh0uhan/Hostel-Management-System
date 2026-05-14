import { Leave } from "../models/leave.js";

// POST /api/leaves — Student: apply for leave
export const applyLeave = async (req, res) => {
    try {
        const { fromDate, toDate, reason, destination, contactDuringLeave } = req.body;
        if (!fromDate || !toDate || !reason)
            throw new Error("fromDate, toDate, and reason are required");

        const from = new Date(fromDate);
        const to = new Date(toDate);
        if (from >= to) throw new Error("toDate must be after fromDate");
        if (from < new Date()) throw new Error("fromDate cannot be in the past");

        const leave = await Leave.create({
            student: req.user._id,
            fromDate: from,
            toDate: to,
            reason,
            destination,
            contactDuringLeave,
        });

        res.status(201).json({ success: true, leave });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// GET /api/leaves/my — Student: view own leave requests
export const getMyLeaves = async (req, res) => {
    try {
        const filter = { student: req.user._id };
        if (req.query.status) filter.status = req.query.status;

        const leaves = await Leave.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, leaves });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// GET /api/leaves — Admin: view all leave requests
export const getAllLeaves = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;

        const leaves = await Leave.find(filter)
            .populate("student", "username email room")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: leaves.length, leaves });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// PUT /api/leaves/:id/review — Admin: approve or reject
export const reviewLeave = async (req, res) => {
    try {
        const { status, adminNote } = req.body;
        if (!["approved", "rejected"].includes(status))
            throw new Error("Status must be 'approved' or 'rejected'");

        const leave = await Leave.findByIdAndUpdate(
            req.params.id,
            { status, adminNote, reviewedAt: new Date() },
            { new: true }
        );
        if (!leave) throw new Error("Leave request not found");

        res.status(200).json({ success: true, leave });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// DELETE /api/leaves/:id — Student: cancel a pending leave request
export const cancelLeave = async (req, res) => {
    try {
        const leave = await Leave.findOne({ _id: req.params.id, student: req.user._id });
        if (!leave) throw new Error("Leave request not found");
        if (leave.status !== "pending")
            throw new Error("Cannot cancel a leave that has already been reviewed");

        await leave.deleteOne();
        res.status(200).json({ success: true, message: "Leave request cancelled" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};