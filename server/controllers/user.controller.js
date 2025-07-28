import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../config/dataURI.js";
import cloudinary from "../config/cloudinary.js";

// @desc     Register a new user
// @route    POST /api/user/register
// @access   Public
export const register = async (req, res) => {
  const { fullName, email, phoneNumber, password } = req.body;
  const file = req.file;

  try {
    // console.log("➡️ REGISTER CONTROLLER STARTED");
    // console.log("➡️ req.body:", req.body);
    // console.log("➡️ req.file:", req.file);

    if (!fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required.", success: false });
    }

    // Optional: Pre-check for email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already registered.", success: false });
    }

    // Optional: Pre-check for phone number
    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number is already registered.", success: false });
    }

    let profilePicUrl = "";
    if (file) {
      // console.log("uploading to cloud...");
      const fileUri = getDataUri(file);
      // console.log("file uri:", fileUri);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      // console.log("➡️ Cloudinary response:", cloudResponse);
      profilePicUrl = cloudResponse.secure_url;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      profilePic: profilePicUrl,
    });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing");
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        message: "User registered successfully.",
        success: true,
        token,
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          profilePic: newUser.profilePic,
        },
      });
  } catch (error) {
    console.error("Error in register controller:", error.message);

    // Catch MongoDB duplicate key error
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      const duplicateValue = error.keyValue[duplicateField];

      let message = "";
      if (duplicateField === "email") {
        message = `Email "${duplicateValue}" is already registered.`;
      } else if (duplicateField === "phoneNumber") {
        message = `Phone number "${duplicateValue}" is already registered.`;
      } else {
        message = `${duplicateField} already exists.`;
      }

      return res.status(400).json({ message, success: false });
    }

    return res.status(500).json({ message: "Internal server error", success: false });
  }
};
// @desc     Login user
// @route    POST /api/user/login
// @access   Public
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // validate data
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required.", success: false });
    }

    // verify login credentials
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid credentials.", success: false });
    }
    // match passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials.", success: false });
    }

    // generate jwt token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production", // only send over https in prod
      })
      .json({
        message: "Login successfull",
        success: true,
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          profilePic: user.profilePic,
        },
      });
  } catch (error) {
    console.log("Error in login controller ", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc     Logout user
// @route    POST /api/user/logout
// @access   Private
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.log("Error in Logout controller ", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc   Get logged-in user
// @route  GET /api/user/check
// @access Private
export const checkUser = async (req, res) => {
  try {
    // if user is authenticated, return user data
    // req.id is set by the protect middleware after token verification
    const user = await User.findById(req.id).select("-password"); // exclude password field

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // return user data
    return res.status(200).json({ message: "User found", success: true, user });
  } catch (error) {
    console.log("Error in check user controller", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc     Update user profile (only phone number and profile picture)
// @route    PUT /api/user/update-profile
// @access   Private
export const updateProfile = async (req, res) => {
  const { phoneNumber } = req.body;
  const profilePicFile = req.file;
  try {
    let cloudResponse = "";
    if (profilePicFile) {
      const fileUri = getDataUri(profilePicFile);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }

    const userId = req.id; // it comes from middleware authentication

    let user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // updating the user details
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }
    if (cloudResponse) {
      user.profilePic = cloudResponse.secure_url;
    }

    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.log("Error in updateProfile controller. ", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
