const express = require("express");
const clc = require("cli-color");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//file imports
const UserSchema = require("./UserSchema");
const { cleanUpAndValidate } = require("./utils/AuthUtils");

//variables
const app = express();
const PORT = process.env.PORT || 8000;
const saltround = 12;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
mongoose.set("strictQuery", false);

//mongodb connection
const MongoURI = `mongodb+srv://karan:12345@cluster0.3ije6wh.mongodb.net/jan-todoApp`;

mongoose
  .connect(MongoURI)
  .then((res) => {
    console.log(clc.yellow("Connected to MongoDb!"));
  })
  .catch((err) => {
    console.log(clc.red(err));
  });

app.get("/", (req, res) => {
  return res.send("This is your TODO App");
});

//get request for register and login
app.get("/register", (req, res) => {
  return res.render("register");
});

app.get("/login", (req, res) => {
  return res.render("login");
});

//post req
app.post("/register", async (req, res) => {
  //validate the data
  const { name, email, password, username } = req.body;

  try {
    await cleanUpAndValidate({ name, password, username, email });
  } catch (error) {
    return res.send({
      status: 402,
      error: error,
    });
  }

  //hash your password
  //abc123 --> fhdalflk;fmn;aff541cddcc
  //bcrypt --> md5

  const hashedPassword = await bcrypt.hash(password, saltround);
  console.log(hashedPassword);

  // create a user
  let user = new UserSchema({
    name: name,
    email: email,
    password: hashedPassword,
    username: username,
  });

  //mongoose.schema --> userSchema.find --> user

  // user exits or not

  let userExits;
  try {
    userExits = await UserSchema.findOne({ email });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Internal server error, Please try again!",
      error: error,
    });
  }
  console.log(userExits);
  if (userExits) {
    return res.send({
      status: 403,
      message: "User already exists",
    });
  }

  //create the user
  try {
    const userDb = await user.save(); //creates a user in Db
    // console.log(userDb);
    return res.send({
      status: 201,
      message: "Regisration is successfull",
      data: userDb,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 400,
      message: "Regisration is Unsuccessfull",
      error: err,
    });
  }
});

app.post("/login", (req, res) => {
  console.log(req.body);
  //validate the data
  //what is loginId (email, username)  package??
  //find the user with email || username
  //match the password

  //return status 200

  return res.status(200);
});

app.listen(PORT, () => {
  console.log(clc.yellow(`App is running at `));
  console.log(clc.blue(`http://localhost:${PORT}`));
});
