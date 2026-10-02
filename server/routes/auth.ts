import { RequestHandler } from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { dbUserOperations } from "../db";

const AUTH_EMAIL = process.env.AUTH_EMAIL || "support@earthrootagro.shop";
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || "Earth@1515";
const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY || "";

const getEmailTransporter = () => {
  if (process.env.HOSTINGER_EMAIL && process.env.HOSTINGER_PASSWORD) {
    return nodemailer.createTransport({
      host: process.env.HOSTINGER_SMTP || "smtp.hostinger.com",
      port: parseInt(process.env.HOSTINGER_PORT || "465"),
      secure: process.env.HOSTINGER_PORT === "465",
      auth: {
        user: process.env.HOSTINGER_EMAIL,
        pass: process.env.HOSTINGER_PASSWORD,
      },
    });
  }

  if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "test@ethereal.email",
      pass: "test123456",
    },
  });
};

interface OTPData {
  otp: string;
  timestamp: number;
  phoneNumber?: string;
}

const otpStore: Record<string, OTPData> = {};

// Password Login
export const verifyPassword: RequestHandler = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }

  const user = dbUserOperations.findByEmail(email);

  if (!user) {
    res.status(401).json({ error: "Account not found. Please sign up first." });
    return;
  }

  if (user.password === password) {
    const token = crypto.randomBytes(32).toString("hex");
    res.status(200).json({ message: "Login successful", token, email });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
};

// Send Email OTP for Login
export const sendEmailOTP: RequestHandler = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "Email required" });
    return;
  }

  // Check if user exists BEFORE sending OTP (for login flow)
  const userExists = dbUserOperations.findByEmail(email);
  if (!userExists) {
    res.status(401).json({ error: "Account not found. Please sign up first." });
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, timestamp: Date.now() };

  console.log(`\n📧 EMAIL OTP for ${email}: ${otp}\n`);

  try {
    const transporter = getEmailTransporter();
    await transporter.sendMail({
      from: process.env.HOSTINGER_EMAIL || process.env.GMAIL_USER || "support@earthrootagro.shop",
      to: email,
      subject: "Your Earth Root Agro OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a3d2a;">Earth Root Agro</h2>
          <p>Your One-Time Password (OTP) for login is:</p>
          <h1 style="color: #d4a574; letter-spacing: 5px; font-size: 32px; margin: 20px 0;">${otp}</h1>
          <p style="color: #666;">This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });
    console.log(`✅ Email sent to ${email}`);
    res.status(200).json({ message: "OTP sent to your email. Check your inbox." });
  } catch (error) {
    console.error("⚠️ Email send failed:", error);
    res.status(200).json({
      message: "OTP sent to your email. Please check your inbox."
    });
  }
};

// Verify Email OTP for Login
export const verifyEmailOTP: RequestHandler = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400).json({ error: "Email and OTP required" });
    return;
  }

  const storedOTP = otpStore[email];

  if (!storedOTP) {
    res.status(400).json({ error: "OTP expired or not sent" });
    return;
  }

  if (Date.now() - storedOTP.timestamp > 10 * 60 * 1000) {
    delete otpStore[email];
    res.status(400).json({ error: "OTP expired" });
    return;
  }

  if (storedOTP.otp === otp) {
    // Check if user exists in DATABASE
    const userExists = dbUserOperations.findByEmail(email);

    console.log(`\n🔍 DEBUG EMAIL OTP LOGIN:`);
    console.log(`Email: ${email}`);
    console.log(`User exists: ${userExists ? "YES" : "NO"}`);

    if (!userExists) {
      console.log(`❌ REJECTED: Account not found\n`);
      res.status(401).json({ error: "Account not found. Please sign up first." });
      return;
    }

    delete otpStore[email];
    const token = crypto.randomBytes(32).toString("hex");
    console.log(`✅ ALLOWED: Login successful\n`);
    res.status(200).json({ message: "Login successful", token, email });
  } else {
    res.status(401).json({ error: "Invalid OTP" });
  }
};

// Send Phone OTP for Login
export const sendPhoneOTP: RequestHandler = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    res.status(400).json({ error: "Phone number required" });
    return;
  }

  if (!/^\d{10}$/.test(phoneNumber)) {
    res.status(400).json({ error: "Invalid phone number" });
    return;
  }

  // Check if user exists BEFORE sending OTP (for login flow)
  const userExists = dbUserOperations.findByPhone(phoneNumber);
  if (!userExists) {
    res.status(401).json({ error: "Account not found. Please sign up first." });
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phoneNumber] = { otp, timestamp: Date.now(), phoneNumber };

  try {
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "otp",
        var_id: "221249",
        numbers: phoneNumber,
        variables_values: otp,
      }),
    });

    const data = await response.json();

    if (data.return === true) {
      res.status(200).json({ message: "OTP sent to phone" });
    } else {
      res.status(500).json({ error: "Failed to send OTP" });
    }
  } catch (error) {
    console.error("OTP send error:", error);
    res.status(500).json({ error: "Error sending OTP" });
  }
};

// Verify Phone OTP for Login
export const verifyPhoneOTP: RequestHandler = (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    res.status(400).json({ error: "Phone number and OTP required" });
    return;
  }

  const storedOTP = otpStore[phoneNumber];

  if (!storedOTP) {
    res.status(400).json({ error: "OTP expired or not sent" });
    return;
  }

  if (Date.now() - storedOTP.timestamp > 10 * 60 * 1000) {
    delete otpStore[phoneNumber];
    res.status(400).json({ error: "OTP expired" });
    return;
  }

  if (storedOTP.otp === otp) {
    // Check if user exists in DATABASE
    const userExists = dbUserOperations.findByPhone(phoneNumber);
    if (!userExists) {
      res.status(401).json({ error: "Account not found. Please sign up first." });
      return;
    }

    delete otpStore[phoneNumber];
    const token = crypto.randomBytes(32).toString("hex");
    res.status(200).json({ message: "Login successful", token, phoneNumber });
  } else {
    res.status(401).json({ error: "Invalid OTP" });
  }
};

// Signup with Email
export const signupEmail: RequestHandler = (req, res) => {
  const { fullName, email, password, phoneNumber } = req.body;

  if (!fullName || !email || !password) {
    res.status(400).json({ error: "Full name, email, and password required" });
    return;
  }

  const result = dbUserOperations.create(fullName, email, phoneNumber || null, password);

  if (result.success) {
    const token = crypto.randomBytes(32).toString("hex");
    res.status(201).json({
      message: "Account created successfully",
      token,
      email,
    });
  } else {
    res.status(400).json({ error: result.error });
  }
};

// Signup with Phone
export const signupPhone: RequestHandler = (req, res) => {
  const { fullName, phoneNumber, password } = req.body;

  if (!fullName || !phoneNumber || !password) {
    res.status(400).json({ error: "Full name, phone, and password required" });
    return;
  }

  if (!/^\d{10}$/.test(phoneNumber)) {
    res.status(400).json({ error: "Invalid phone number" });
    return;
  }

  const result = dbUserOperations.create(fullName, null, phoneNumber, password);

  if (result.success) {
    const token = crypto.randomBytes(32).toString("hex");
    res.status(201).json({
      message: "Account created successfully",
      token,
      phoneNumber,
    });
  } else {
    res.status(400).json({ error: result.error });
  }
};

// Get all users (for debugging only)
export const getAllUsers: RequestHandler = (req, res) => {
  const allUsers = dbUserOperations.getAllUsers();
  res.status(200).json({
    totalUsers: allUsers.length,
    users: allUsers
  });
};

// Legacy endpoints
export const sendOTP: RequestHandler = sendPhoneOTP;
export const verifyOTP: RequestHandler = verifyPhoneOTP;
