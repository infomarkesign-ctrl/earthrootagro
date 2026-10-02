import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  verifyPassword,
  sendEmailOTP,
  verifyEmailOTP,
  sendPhoneOTP,
  verifyPhoneOTP,
  signupEmail,
  signupPhone,
  getAllUsers,
  sendOTP,
  verifyOTP,
} from "./routes/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes - Login
  app.post("/api/auth/verify-password", verifyPassword);
  app.post("/api/auth/send-email-otp", sendEmailOTP);
  app.post("/api/auth/verify-email-otp", verifyEmailOTP);
  app.post("/api/auth/send-phone-otp", sendPhoneOTP);
  app.post("/api/auth/verify-phone-otp", verifyPhoneOTP);

  // Auth routes - Signup
  app.post("/api/auth/signup-email", signupEmail);
  app.post("/api/auth/signup-phone", signupPhone);

  // Debug endpoint - Get all users
  app.get("/api/auth/users", getAllUsers);

  // Legacy routes for compatibility
  app.post("/api/auth/send-otp", sendOTP);
  app.post("/api/auth/verify-otp", verifyOTP);

  return app;
}
