import express from "express";
import authRouter from "./routes/auth.routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./db/dbConnection.js";
dotenv.config();
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
// Listening on Server
app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
