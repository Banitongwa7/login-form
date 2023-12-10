const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql");

dotenv.config({ path: "./.env" });
const PORT = process.env.PORT;

const app = express();

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

app.get("/", (req, res) => {
  res.render("./client/index.html");
});

app.post("/auth/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let dbConnect = true

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });
  }

  // Connect to the MySQL database
  db.connect((error) => {
    if (error) {
      dbConnect = false
    }
  });

  if(dbConnect){
    db.query(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email, password],
        (error, results) => {
          if (error) {
            console.log(error);
          }
          if (results.length > 0) {
            res.send({ success: true });
          } else {
            res.send({ success: false });
          }
        }
      );
  }else{
    console.log("Error connecting to the database");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
