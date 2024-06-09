import express from "express";
import authRouter from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectDb from "./db/dbConnection.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
// Connecting to DB
connectDb();
// API Endpoints
app.use("/api/auth", authRouter);
// Listening on Server
app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
