import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { validateLogin, validateRegister } from "../utils/validation.js";
import { generateToken } from "../utils/jwt.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: 'true',
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req, res) => {
    try {
        validateRegister(req.body);

        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) throw new Error("Username or email already in use");

        const user = await User.create({ username, email, password });

        const token = generateToken(user);

        res.cookie("token", token, COOKIE_OPTIONS).status(201).json({
            success: true,
            message: "Registered successfully",
            user: { _id: user._id, username: user.username, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error("Register error:", err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};

export const registerAdmin = async (req, res) => {
    try {
        validateRegister(req.body);

        const { username, email, password, adminSecretKey } = req.body;

        if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
            throw new Error("Invalid admin secret key");
        }

        const existingAdmin = await User.findOne({ $or: [{ username }, { email }] });
        if (existingAdmin) throw new Error("Admin with this username or email already exists");

        const admin = await User.create({ username, email, password, role: "admin" });
        const token = generateToken(admin);

        res.cookie("token", token, COOKIE_OPTIONS).status(201).json({
            success: true,
            message: "Admin registered successfully",
            user: { _id: admin._id, username: admin.username, email: admin.email, role: admin.role },
        });
    } catch (err) {
        console.error("Register admin error:", err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        validateLogin(req.body);

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) throw new Error("Invalid email or password");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid email or password");

        const token = generateToken(user);

        res.cookie("token", token, COOKIE_OPTIONS).status(200).json({
            success: true,
            message: "Login successful",
            user: { _id: user._id, username: user.username, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", { path: "/" }).status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (err) {
        console.error("Logout error:", err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("room");
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};