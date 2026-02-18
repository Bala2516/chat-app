import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js"

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.CLIENT_URL}/api/oauth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, cb) => {
      try {
        const mode = req.query.state; 
        console.log("MODE:", mode);

        const email = profile.emails?.[0]?.value;
        const profilePic = profile.photos?.[0]?.value;
        if (!email) return cb(null, false);

        let user = await User.findOne({ email });

        if (mode === "signup" && user) {
          return cb(null, false);
        }

        if (mode === "login" && !user) {
          return cb(null, false);
        }

        if (!user && mode === "signup") {
          let uploadedPic = null;

          if (profilePic) {
            const uploadRes = await cloudinary.uploader.upload(profilePic, {
              folder: "profile-pics",
            });

            uploadedPic = uploadRes.secure_url;
          }

          user = await User.create({
            email,
            fullName: profile.displayName,
            googleId: profile.id,
            profilePic:uploadedPic,
          });
        }

        if (!user) {
          return cb(null, false);
        }

        return cb(null, user);
      } catch (err) {
        return cb(err, null);
      }
    },
  ),
);
