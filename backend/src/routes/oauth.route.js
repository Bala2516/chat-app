import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/google/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "login",
  }),
);

router.get(
  "/google/signup",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "signup",
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/auth-success?error=not_found`,
  }),
  (req, res) => {
    try {
      const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      const mode = req.query.state;
      res.redirect(
        `${process.env.CLIENT_URL}/auth-success?token=${token}&state=${mode}`,
      );
    } catch (error) {
      console.error("Google login error:", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);
    }
  },
);

router.get("/me", protectRoute, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
