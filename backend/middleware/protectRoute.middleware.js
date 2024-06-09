import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(201).json({ error: "Unauthorised No Token Provided" });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorised Invalid Token" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protected route middleware", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
