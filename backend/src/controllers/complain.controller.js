import { Complaint } from "../models/complaint.js";

// POST /api/complaints — Student: raise a complaint
export const createComplaint = async (req, res) => {
    try {
        const { category, title, description } = req.body;
        if (!category || !title || !description)
            throw new Error("category, title, and description are required");

        const complaint = await Complaint.create({
            student: req.user._id,
            category,
            title,
            description,
        });

        res.status(201).json({ success: true, complaint });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// GET /api/complaints/my — Student: view own complaints
export const getMyComplaints = async (req, res) => {
    try {
        const filter = { student: req.user._id };
        if (req.query.status) filter.status = req.query.status;

        const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, complaints });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// GET /api/complaints — Admin: view all complaints (with filters)
export const getAllComplaints = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.category) filter.category = req.query.category;

        const complaints = await Complaint.find(filter)
            .populate("student", "username email room")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: complaints.length, complaints });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// PUT /api/complaints/:id/status — Admin: update complaint status
export const updateComplaintStatus = async (req, res) => {
    try {
        const { status, adminNote } = req.body;
        if (!["pending", "in_progress", "resolved"].includes(status))
            throw new Error("Invalid status value");

        const update = { status, adminNote };
        if (status === "resolved") update.resolvedAt = new Date();

        const complaint = await Complaint.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!complaint) throw new Error("Complaint not found");

        res.status(200).json({ success: true, complaint });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// DELETE /api/complaints/:id — Student: delete their own complaint (if still pending)
export const deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findOne({
            _id: req.params.id,
            student: req.user._id,
        });
        if (!complaint) throw new Error("Complaint not found");
        if (complaint.status !== "pending")
            throw new Error("Cannot delete a complaint that is already being processed");

        await complaint.deleteOne();
        res.status(200).json({ success: true, message: "Complaint deleted" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};