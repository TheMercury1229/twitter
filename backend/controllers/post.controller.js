import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
// Create A Post
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    // Checking if both the fields are empty
    if (!text && !img) {
      return res
        .status(400)
        .json({ messsage: "Post must have a text or image" });
    }
    // Uploading the img to cloudinary if it is there
    if (img) {
      const uploadedRes = await cloudinary.uploader.upload(img);
      img = uploadedRes.secure_url;
    }
    // Creating the post
    const newPost = new Post({
      text,
      img,
      user: userId,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error in create Post controller", error);
    res.status(500).json({
      error: error.message,
    });
  }
};
// Like or unlike a post
export const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      // Unlike Post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne(
        { _id: userId },
        {
          $pull: {
            likedPost: postId,
          },
        }
      );
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // Like Post
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPost: postId } });
      await post.save();
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.log("Error in like unlike Post controller", error);
    res.status(500).json({
      error: error.message,
    });
  }
};
// Comment on a post
export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text)
      return res.status(400).json({ message: "Text field is required" });
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = { user: userId, text };
    post.comment.push(comment);
    await post.save();
    const notification = new Notification({
      from: userId,
      to: post.user,
      type: "comment",
    });
    await notification.save();
    res.status(200).json(post);
  } catch (error) {
    console.log("Error in Comment Post controller", error);
    res.status(500).json({
      error: error.message,
    });
  }
};
// Delete A Post
export const deletePost = async (req, res) => {
  try {
    // Finding the post from id
    const post = await Post.findById(req.params.id);
    // Checking if the post exist
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    // Checking if the owner of post and authorised user are same
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "You are unauthorised to delete this post" });
    }
    // Deleting the img from cloudinary
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    // Deleting the post
    await Post.findByIdAndDelete(req.params._id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in delete post controller", error);
    res.status(500).json({ error: error.message });
  }
};
// Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    // Getting post and user profile who created it
    const posts = await Post.find()
      .sort({ createdAt: 1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comment.user",
        select: "-password",
      });
    if (posts.length < 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in get all post controller", error);
    res.status(500).json({ error: error.message });
  }
};
// Get Liked Posts
export const getLikedPost = async (req, res) => {
  const userId = req.params.id;
  try {
    // Finding The User
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    // Finding Users liked post and finding users and comments posted user profiles
    const likedPost = await Post.find({ _id: { $in: user.likedPost } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comment.user",
        select: "-password",
      });
    res.status(200).json(likedPost);
  } catch (error) {
    console.log("Error in get liked post controller", error);
    res.status(500).json({ error: error.message });
  }
};
// get following posts
export const getFollowingPost = async (req, res) => {
  // Getting user id
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    // Getting user following
    const following = user.following;
    // Finding Posts of following posts
    const feedPosts = await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comment.user",
        select: "-password",
      });
    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error in get following post controller", error);
    res.status(500).json({ error: error.message });
  }
};
//get user posts
export const getUserPost = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comment.user",
        select: "-password",
      });
    return res.status(200).json(posts);
  } catch (error) {
    console.log("Error in get user post controller", error);
    res.status(500).json({ error: error.message });
  }
};
