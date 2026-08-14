import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/v1/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(new Error("No email found in Google profile"), undefined);
        }

        let user = await User.findOne({ email });

        if (!user) {
          // If user doesn't exist, create a new one
          user = await User.create({
            email,
            googleId: profile.id,
            name: profile.displayName,
            profileImage: profile.photos?.[0].value || "",
            isVerified: true, // Google accounts are verified
          });
        } else {
          if (user.isSuspended) {
            return done(new Error("Account is Suspended"), undefined);
          }
          if (!user.googleId) {
            // If user exists but wasn't linked to Google, link it
            user.googleId = profile.id;
            if (!user.profileImage) user.profileImage = profile.photos?.[0].value || "";
            await user.save();
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
