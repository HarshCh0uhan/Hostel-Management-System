import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: String,
            enum: ["electricity", "water", "cleaning", "internet", "other"],
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["pending", "in_progress", "resolved"],
            default: "pending",
        },
        adminNote: {
            type: String,
            trim: true,
            default: null,
        },
        resolvedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export const Complaint = mongoose.model("Complaint", complaintSchema);