import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
// DB Imports
import connectDb from "./db/dbConnection.js";
// Routes Imports
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
// Config of cloudinary and dotenv
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Express Configuring
const app = express();
const PORT = process.env.PORT;
// Middlewares
app.use(express.json()); //To parse req.body
app.use(express.urlencoded({ extended: true })); //To parse form data
app.use(cookieParser()); //To parse the cookies
// Connecting to DB
connectDb();
// API Endpoints
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

// Listening on Server
app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
