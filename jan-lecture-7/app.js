const express = require("express");
const clc = require("cli-color");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const session = require("express-session");
const mongoDBSession = require("connect-mongodb-session")(session);

//file imports
const UserSchema = require("./UserSchema");
const { cleanUpAndValidate } = require("./utils/AuthUtils");
const { isAuth } = require("./middleware.js/authMiddleware");
const { Session } = require("express-session");

//variables
const app = express();
const PORT = process.env.PORT || 8000;
const saltround = 12;

//mongodb connection
const MongoURI = `mongodb+srv://karan:12345@cluster0.3ije6wh.mongodb.net/jan-todoApp`;
mongoose.set("strictQuery", false);
mongoose
  .connect(MongoURI)
  .then((res) => {
    console.log(clc.yellow("Connected to MongoDb!"));
  })
  .catch((err) => {
    console.log(clc.red(err));
  });

//middlewares
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

//session

const store = new mongoDBSession({
  uri: MongoURI,
  collection: "sessions",
});

app.use(
  session({
    secret: "this is jan nodejs class",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

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
    return res.status(200).redirect("/login");
  } catch (err) {
    console.log(err);
    return res.send({
      status: 400,
      message: "Regisration is Unsuccessfull",
      error: err,
    });
  }
});

app.post("/login", async (req, res) => {
  console.log(req.body);

  //validate the data
  const { loginId, password } = req.body;

  if (
    !loginId ||
    !password ||
    typeof loginId !== "string" ||
    typeof password !== "string"
  ) {
    return res.send({
      status: 400,
      message: "Invalid Data",
    });
  }

  let userDb;

  try {
    if (validator.isEmail(loginId)) {
      userDb = await UserSchema.findOne({ email: loginId });
    } else {
      userDb = await UserSchema.findOne({ username: loginId });
    }

    //if user doesnot exist
    if (!userDb) {
      return res.send({
        status: 401,
        message: "User not found, Please Register first.",
      });
    }
    console.log(userDb);
    //compare the req.body.password(plain password) with userdb.password (hashed)

    const isMatch = await bcrypt.compare(password, userDb.password);

    if (!isMatch) {
      return res.send({
        status: 403,
        message: "Incorrect Password",
        data: userDb,
      });
    }
    console.log(req.session);

    req.session.isAuth = true;
    req.session.user = {
      username: userDb.username,
      email: userDb.email,
      userId: userDb._id,
    };

    //final return
    return res.status(200).redirect("/dashboard");
    // return res.send({
    //   status: 200,
    //   message: "Login Successfull",
    //   data: userDb,
    // });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      message: "Database Error",
      error: error,
    });
  }
});

// app.get("/home", isAuth, (req, res) => {
//   console.log(req.session);
//   return res.send("This is your home page");
// });

app.get("/dashboard", isAuth, (req, res) => {
  return res.render("dashboard");
});

app.post("/logout", isAuth, (req, res) => {
  console.log(req.session.user);

  req.session.destroy((err) => {
    if (err) throw err;

    res.redirect("/login");
  });
});

app.listen(PORT, () => {
  console.log(clc.yellow(`App is running at `));
  console.log(clc.blue(`http://localhost:${PORT}`));
});

//Registration
//UI
//Route
//user creation

//login
//Session auth
//Auth middleware
//dashboard UI
//logout

//logout from all the device
//routes for 'create-todo'

//routes for "edit-todo"
//routes for "delete-todo"
//dashboard page
//pagination
//rate-limiting
