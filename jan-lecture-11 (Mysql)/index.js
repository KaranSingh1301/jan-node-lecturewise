const express = require("express");
const mysql = require("mysql");
const app = express();
app.use(express.json());

//Db config
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Karan@130101",
  database: "tododb",
  multipleStatements: true,
});

db.connect(function (err) {
  if (err) throw err;
  console.log("DB is connected");
});

app.get("/", (req, res) => {
  res.send("welcome to my server");
});

app.get("/todo", (req, res) => {
  db.query("SELECT * FROM users", {}, (err, users) => {
    console.log(users);
    if (users) {
      return res.send({
        status: 200,
        message: "success",
        data: users,
      });
    } else {
      return res.status(400).send(false);
    }
  });
});

app.post("/register", (req, res) => {
  const newUser = req.body;

  db.query(
    "INSERT INTO users (todoId, userName, email, password) VALUES (?,?,?,?)",
    ["1348", newUser.name, newUser.email, newUser.password],
    (err, user) => {
      if (err) {
        console.log(err);
        return res.status(400).send(false);
      } else {
        return res.status(200).send(true);
      }
    }
  );
});

app.listen(8000, () => {
  console.log("Listenning to port 8000");
});
