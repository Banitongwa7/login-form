const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql");
const path = require("path");
dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 3000;
const app = express();

// Connect to the MySQL database
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MySQL Connected...");
  }
});

app.use(express.urlencoded({ extended: "false" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/index.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/home.html"));
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (error, results) => {
      if (error) {
        console.log("Database query error");
      }
      if (results.length > 0) {
        console.log("Login successful");
      } else {
        console.log("Invalid username or password");
      }
    }
    );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
