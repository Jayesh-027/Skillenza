const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Keshav@30",
  database: "smart_job_portal",
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ Connected to MySQL database (smart_job_portal)");
});

module.exports = db;
