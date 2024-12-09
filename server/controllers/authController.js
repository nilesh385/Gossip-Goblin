import jwt from "jsonwebtoken";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import config from "../config/env.js";
import bcrypt from "bcrypt";

const JWT_SECRET = config.jwtSecret;

export const signup = async (req, res) => {
  try {
    const { email, username, fullName, password, bio } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email already in use"
            : "Username already taken",
      });
    }
    const hashedPass = await bcrypt.hash(password, 12);
    let profilePicUrl = "";

    // Handle profile picture upload
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "goblingossip/",
          transformation: [{ width: 500, height: 500, crop: "fill" }],
        });
        profilePicUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res
          .status(500)
          .json({ message: "Failed to upload profile picture" });
      }
    }

    const newUser = new User({
      email,
      username,
      fullName,
      password: hashedPass,
      profilePic: profilePicUrl,
      bio,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);

    // Exclude password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;
    console.log("User Signed-up=>>>>>>>>>>>>> ", userResponse.fullName);

    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const comparedPass = await bcrypt.compare(password, user.password);
    if (password !== comparedPass) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    // Exclude password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    console.log(
      "User Logged-in Successfully=>>>>>>>>>>>>> ",
      userResponse.fullName
    );

    res.json({ token, user: userResponse });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
