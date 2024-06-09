import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
// Sign Up
export const signup = async (req, res) => {
  try {
    const salt = await bcryptjs.genSalt(10);
    const { fullName, username, password, email } = req.body;
    // Validating Email
    const emailRegx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegx.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    // Checking for existing Username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }
    // Checking for existing Email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }
    // Checking Password Length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password should atleast have 6 characters" });
    }
    // Hashing The Password
    const hashedPass = bcryptjs.hashSync(password, salt);
    const newUser = new User({
      fullName,
      email,
      username,
      password: hashedPass,
    });
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profilePic: newUser.profilePic,
        coverPic: newUser.coverPic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log("Error in sign up controller", error);
  }
};
// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPassCorrect = await bcryptjs.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPassCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    generateTokenAndSetCookie(user._id, res);

    res.status(201).json({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profilePic: user.profilePic,
      coverPic: user.coverPic,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });

    console.log("Error in login controller", error);
  }
};
// Logout
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });

    console.log("Error in logout controller", error);
  }
};
// Get Me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in get me controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
