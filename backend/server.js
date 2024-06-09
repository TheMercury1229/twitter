import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
// DB Imports
import connectDb from "./db/dbConnection.js";
// Routes Imports
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

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

// Listening on Server
app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
