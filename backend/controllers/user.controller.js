import User from "../models/user.model.js";
// Get User Profile
export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({
        error: "User Not Found",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in get user profile", error);
    res.status(500).json({ error: error.message });
  }
};
// Follow and Unfollow User
import mongoose from "mongoose";

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id); // From the protected route middleware

    // Check if both ids are equal
    if (id === String(req.user._id)) {
      return res.status(400).json({
        error: "You cannot follow or unfollow your own profile",
      });
    }

    // Check for user presence
    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow the user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in follow and unfollow", error);
    res.status(500).json({ error: error.message });
  }
};
