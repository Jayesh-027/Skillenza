const express = require("express");
const multer = require("multer");
const db = require("../db");

const router = express.Router();

// Store files with original name
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

// Upload Resume Route
router.post("/upload", upload.single("resume"), (req, res) => {
  const { name, email } = req.body;
  const filePath = req.file ? req.file.path : null;

  if (!name || !email || !filePath) {
    return res.json({ success: false, message: "All fields are required" });
  }

  const query = "INSERT INTO resumes (name, email, file_path) VALUES (?, ?, ?)";
  db.query(query, [name, email, filePath], (err) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: "Error saving resume" });
    }
    res.json({ success: true, message: "Resume uploaded successfully!" });
  });
});

module.exports = router;
