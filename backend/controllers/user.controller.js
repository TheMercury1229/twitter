import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
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
    // Checking wheter user is following user to modify
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
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });
      await newNotification.save();
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in follow and unfollow", error);
    res.status(500).json({ error: error.message });
  }
};
// Get Suggested User
export const getSuggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("following");
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));
    res.status(200).json({ suggestedUsers });
  } catch (error) {
    console.log("Error in get suggest user", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profilePic, coverPic } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    // Checking if both password are correct
    if (
      (!currentPassword && newPassword) ||
      (currentPassword && !newPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }
    // Password Match
    if (currentPassword && newPassword) {
      const isMatch = bcryptjs.compareSync(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current Password is Incorrect" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "New Password should contain atleast 6 characters.",
        });
      }
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(newPassword, salt);
    }
    // Uploading Profile Image
    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      const uplaodResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uplaodResponse.secure_url;
    }
    // Uploading cover image
    if (coverPic) {
      if (user.coverPic) {
        await cloudinary.uploader.destroy(
          user.coverPic.split("/").pop().split(".")[0]
        );
      }
      const uplaodResponse = await cloudinary.uploader.upload(coverPic);
      coverPic = uplaodResponse.secure_url;
    }
    // Updating profile
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.coverPic = coverPic || user.coverPic;
    user = await user.save();
    // Password will be null in the response
    user.password = null;
    return res.status(201).json(user);
  } catch (error) {
    console.log("Error in get update profile user", error);
    res.status(500).json({ error: error.message });
  }
};
