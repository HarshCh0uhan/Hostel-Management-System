import express from "express"
import dotenv from "dotenv"
import connectDB from "./src/config/db.js"
import cookieParser from "cookie-parser"

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

connectDB().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log("Listening to Server");
    })
}).catch((err) => {
    console.log("Database Connection cannot be Established !!!" + err.message);
})