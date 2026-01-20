require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const db = require("./db");
const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resume");

const app = express();

// ===== Middleware =====
app.use(
  cors({
    origin: "http://localhost:5500", // your frontend origin
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ===== Session Setup =====
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// ===== Passport Setup =====
app.use(passport.initialize());
app.use(passport.session());

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// ===== Test Route =====
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running fine ✅" });
});

// ===== Start Server =====
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
