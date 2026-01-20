const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const router = express.Router();

// =============== GOOGLE STRATEGY CONFIG ===============
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // must match Google Console
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const name = profile.displayName;

      // Check if user exists
      db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) return done(err);

        if (result.length > 0) {
          return done(null, result[0]);
        } else {
          const q = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
          db.query(q, [name, email, null], (err2) => {
            if (err2) return done(err2);

            db.query("SELECT * FROM users WHERE email = ?", [email], (err3, result2) => {
              if (err3) return done(err3);
              return done(null, result2[0]);
            });
          });
        }
      });
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// =============== GOOGLE ROUTES ===============

// Step 1: Start Google Auth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Step 2: Callback route (must match the one in .env and Google Console)
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login.html" }),
  (req, res) => {
    const user = req.user;
    const userData = { email: user.email, name: user.name };

    // Redirect to frontend
    res.redirect(
      `http://localhost:5500/frontend/index.html?user=${encodeURIComponent(
        JSON.stringify(userData)
      )}`
    );
  }
);

// =============== EMAIL/PASSWORD SIGNUP ===============
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  const hashed = bcrypt.hashSync(password, 8);
  const q = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(q, [name, email, hashed], (err) => {
    if (err) return res.json({ success: false, message: "Signup failed ❌" });
    res.json({ success: true, message: "Signup successful ✅" });
  });
});

// =============== EMAIL/PASSWORD LOGIN ===============
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err || result.length === 0)
      return res.json({ success: false, message: "Invalid email ❌" });

    const user = result[0];
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid)
      return res.json({ success: false, message: "Wrong password ❌" });

    res.json({
      success: true,
      message: "Login successful ✅",
      user: { id: user.id, email: user.email, name: user.name },
    });
  });
});

module.exports = router;
