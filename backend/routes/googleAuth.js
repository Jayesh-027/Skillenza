const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login.html" }),
  (req, res) => {
    res.redirect("http://localhost:5500/frontend/index.html"); // adjust if needed
  }
);

module.exports = router;
