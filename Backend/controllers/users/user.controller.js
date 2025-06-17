import userModel from "../../models/users/user.model.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Get all guests (non-staff users)
export const getAllGuests = async (req, res) => {
  try {
    const users = await userModel.find({ isStaff: false }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get all staff users
export const getAllStaffUsers = async (req, res) => {
  try {
    const users = await userModel.find({ isStaff: true }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get single user
export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid user ID" });
    }

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await userModel.login(userName, password);

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    // Skip token generation
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Signup user
export const signupUser = async (req, res) => {
  const { fullName, userName, email, password, role, phone, isStaff, department } = req.body;

  try {
    const user = await userModel.signup(fullName, userName, email, password, role, phone, isStaff);

    // If department is provided and user is staff, update department
    if (isStaff && department) {
      user.department = department;
      await user.save();
    }

    // Skip token generation
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid user ID" });
    }

    // Get the user to check if password is being updated
    const existingUser = await userModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Handle password update if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    } else {
      // Remove password from the update if it's not provided
      delete req.body.password;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid user ID" });
    }

    const deleted = await userModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Update user status (active/inactive)
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid user ID" });
    }

    if (!status || !["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status value" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Update loyalty points
export const updateLoyaltyPoints = async (req, res) => {
  try {
    const { id } = req.params;
    const { points } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid user ID" });
    }

    if (points === undefined || isNaN(points)) {
      return res.status(400).json({ success: false, error: "Invalid points value" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { loyaltyPoints: points },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Check user authentication
export const checkUser = async (req, res) => {
  try {
    const { user } = req.body;

    if (!user || !user._id) {
      return res.status(400).json({ success: false, error: "Invalid user data" });
    }

    const userFind = await userModel.findById(user._id);

    if (!userFind) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (userFind.userName === user.userName && userFind.email === user.email) {
      return res.status(200).json({ success: true, user: userFind });
    } else {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
