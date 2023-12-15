const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 3000;
const app = express();
const db = require("./database/db");
const { engine } = require("express-handlebars");
const pcrypt = require("bcryptjs");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./client");
app.use(express.static(path.join(__dirname, "/client")));

app.use(express.urlencoded({ extended: "false" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("home");
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

app.post("/auth/register", (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = pcrypt.hashSync(password, pcrypt.genSaltSync(10));

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
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword],
    (error, results) => {
      if (error) {
        console.log("Database query error");
      }
      res.redirect("/");
    }
  )
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
