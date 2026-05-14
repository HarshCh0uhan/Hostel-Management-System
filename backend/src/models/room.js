import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        floor: {
            type: Number,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
            default: 2,
        },
        type: {
            type: String,
            enum: ["single", "double", "triple"],
            default: "double",
        },
        status: {
            type: String,
            enum: ["vacant", "occupied", "maintenance"],
            default: "vacant",
        },
        occupants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        amenities: {
            ac: { type: Boolean, default: false },
            wifi: { type: Boolean, default: true },
            attached_bathroom: { type: Boolean, default: false },
        },
        monthlyRent: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

roomSchema.pre("save", function () {
    if (this.occupants.length === 0) {
        this.status = "vacant";
    } else if (this.occupants.length >= this.capacity) {
        this.status = "occupied";
    }
});

export const Room = mongoose.model("Room", roomSchema);