const express = require("express");
const mongoose = require("mongoose");
const clc = require("cli-color");
require("dotenv").config();
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);

//file-import
const db = require("./db");
const AuthRouter = require("./Controllers/AuthController");
const BlogsRouter = require("./Controllers/BlogsController");
const isAuth = require("./Middlewares/isAuth");

const app = express();
const PORT = process.env.PORT;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const store = new mongoDbSession({
  uri: process.env.MONGO_URI,
  collection: "session",
});

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//routes
app.get("/", (req, res) => {
  return res.send({
    status: 200,
    message: "This is your server",
  });
});

app.use("/auth", AuthRouter);
app.use("/blog", isAuth, BlogsRouter);

app.listen(PORT, () => {
  console.log(clc.blue("Server is running at "));
  console.log(clc.yellow.underline(`http://localhost:${PORT}`));
});

//client <---REQ.Session---> server(8000) <---> routes
