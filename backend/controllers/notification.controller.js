import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const notification = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profilePic",
    });
    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notification);
  } catch (error) {
    console.log("Error in delete all notification controller", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log("Error in delete all notification controller", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteOneNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification Not Found" });
    }
    if (notification.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are unauthorised for this operation" });
    }
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log("Error in delete one notification controller", error);
    res.status(500).json({ error: error.message });
  }
};
