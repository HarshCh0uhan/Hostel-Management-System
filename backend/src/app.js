import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import roomRouter from "./routes/room.route.js";
import complaintRouter from "./routes/complain.route.js";
import leaveRouter from "./routes/leave.route.js";
import adminRouter from "./routes/admin.route.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "https://hostel-management-system-ruddy.vercel.app",
  credentials: true,
}));

app.use("/api/auth", authRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/complaints", complaintRouter);
app.use("/api/leaves", leaveRouter);
app.use("/api/admin", adminRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed: " + err.message);
        process.exit(1);
    });