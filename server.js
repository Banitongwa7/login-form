const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 3000;
const app = express();
const db = require("./database/db");

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

  db.connect((error) => {
    if (error) {
      console.log("Database connection failed");
    } else {
      console.log("Database connected successfully");
    }
  });
  
  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (error, results) => {
      if (error) {
        console.log("Database query error");
      }
      if (results.length > 0) {
        res.redirect("/home");
      } else {
        res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }
    }
  );

  db.end();

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
