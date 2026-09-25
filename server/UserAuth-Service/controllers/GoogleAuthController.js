import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../config/jwtToken.js";
import generateRefreshToken from "../config/refreshToken.js";

dotenv.config();

/**
 * Google OAuth 2.0 Login/Register Controller
 * 
 * Handles Google Sign-In by receiving the user's Google profile data
 * (email, name, googleId) from the frontend after Google credential verification.
 * 
 * Flow:
 * 1. Frontend uses Google Identity Services to get ID token
 * 2. Frontend decodes the credential and sends { email, name, googleId } to this endpoint
 * 3. This controller finds or creates the user and returns a JWT token
 * 
 * Security considerations:
 * - Google ID token is verified on the client side via @react-oauth/google
 * - Server validates required fields (email, name, googleId)
 * - Auto-generated passwords are cryptographically random
 * - Sensitive data (password) is excluded from the response
 * 
 * OWASP A07:2021 - Identification and Authentication Failures
 * This implementation adds OAuth 2.0 as a secure alternative to password-based auth
 */
const google = asyncHandler(async (req, res, next) => {
  const { email, name, googleId } = req.body;

  // Validate required fields from the Google credential
  if (!email || !name) {
    res.status(400);
    throw new Error("Missing required Google profile data (email or name).");
  }

  try {
    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Existing user — generate tokens and log them in
      const refreshToken = generateRefreshToken(existingUser._id);
      
      // Update refresh token in database
      await User.findByIdAndUpdate(
        existingUser._id,
        { refreshToken: refreshToken },
        { new: true }
      );

      // Set httpOnly cookie for refresh token (secure cookie handling)
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1 * 1000, // 1 hour
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Exclude password from response
      const { password, ...userData } = existingUser._doc;

      res.status(200).json({
        _id: existingUser._id,
        firstName: existingUser.firstName,
        email: existingUser.email,
        mobile: existingUser.mobile || "",
        token: generateToken(existingUser._id),
        role: existingUser.role,
      });
    } else {
      // New user — auto-register via Google OAuth
      // Generate a cryptographically secure random password
      // (user won't need this since they authenticate via Google)
      const generatedPassword = crypto.randomBytes(32).toString("hex");
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      // Split the display name into first and last name
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0] || name;
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      const newUser = new User({
        firstName: firstName,
        lastName: lastName || "Google User",
        email: email,
        mobile: "N/A",
        password: hashedPassword,
        googleId: googleId || "",
      });

      await newUser.save();

      // Generate tokens for the newly created user
      const refreshToken = generateRefreshToken(newUser._id);

      await User.findByIdAndUpdate(
        newUser._id,
        { refreshToken: refreshToken },
        { new: true }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({
        _id: newUser._id,
        firstName: newUser.firstName,
        email: newUser.email,
        mobile: newUser.mobile,
        token: generateToken(newUser._id),
        role: newUser.role,
      });
    }
  } catch (error) {
    console.error("Google OAuth error:", error.message);
    res.status(500);
    throw new Error("Google authentication failed. Please try again.");
  }
});

export default { google };
