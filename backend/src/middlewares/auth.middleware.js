import { verifyToken } from "../utils/jwt.js";
import { User } from "../models/user.js";

export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }

        const decoded = verifyToken(token);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin access required" });
    }
    next();
};

export const authorizeStudent = (req, res, next) => {
    if (req.user?.role !== "user") {
        return res.status(403).json({ success: false, message: "Student access required" });
    }
    next();
};