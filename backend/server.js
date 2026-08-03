// Stage Royale Backend Starter
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// OTP Schema
const otpSchema = new mongoose.Schema({
  email: String,
  code: String,
  createdAt: { type: Date, default: Date.now, expires: 300 }, // expires in 5 minutes
  isUsed: { type: Boolean, default: false },
});
const OTP = mongoose.model("OTP", otpSchema);

// User Schema (simplified)
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, // DEV ONLY plain text
  provider: String,
  verified: { type: Boolean, default: false },
});
const User = mongoose.model("User", userSchema);

// Generate 6-digit OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Route: Send OTP
app.post("/api/auth/send-otp", async (req, res) => {
  const { email } = req.body;
  const code = generateOTP();

  await OTP.create({ email, code });
  console.log(`OTP for ${email}: ${code}`); // DEV ONLY

  // TODO: integrate Resend API here
  res.json({ message: "OTP sent to email" });
});

// Route: Verify OTP
app.post("/api/auth/verify-otp", async (req, res) => {
  const { email, code } = req.body;
  const otp = await OTP.findOne({ email, code, isUsed: false });

  if (!otp) return res.status(400).json({ error: "Invalid or expired OTP" });

  otp.isUsed = true;
  await otp.save();

  // Mark user verified
  await User.updateOne({ email }, { verified: true }, { upsert: true });

  res.json({ message: "OTP verified, user logged in" });
});

// Placeholder routes for TikTok, Instagram, X login
app.get("/api/auth/tiktok", (req, res) => res.json({ message: "TikTok login placeholder" }));
app.get("/api/auth/instagram", (req, res) => res.json({ message: "Instagram login placeholder" }));
app.get("/api/auth/x", (req, res) => res.json({ message: "X login placeholder" }));

// Voting route placeholder
app.post("/api/vote/:contestantId", (req, res) => {
  res.json({ message: `Vote recorded for contestant ${req.params.contestantId}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
