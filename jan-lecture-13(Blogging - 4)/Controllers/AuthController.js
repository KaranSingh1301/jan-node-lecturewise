const express = require("express");
const cleanUpAndValidate = require("../utils/AuthUtils");
const AuthRouter = express.Router();
const User = require("../Models/User");
const isAuth = require("../Middlewares/isAuth");

AuthRouter.post("/register", (req, res) => {
  const { email, password, username, name } = req.body;
  cleanUpAndValidate({ name, email, password, username })
    .then(async () => {
      //validate if the user exist or not

      try {
        await User.verifyUsernameAndEmailExits({ username, email });
      } catch (error) {
        return res.send({
          status: 401,
          message: "Error Occured",
          error: error,
        });
      }

      //create a user
      //created an object for user class
      const user = new User({
        email,
        name,
        username,
        password,
      });

      try {
        const userDb = await user.registerUser();

        return res.send({
          status: 201,
          message: "Registration Successfull",
          data: userDb,
        });
      } catch (error) {
        console.log(error);
        return res.send({
          status: 400,
          message: "Error Occured",
          error: error,
        });
      }
    })
    .catch((err) => {
      return res.send({
        status: 400,
        message: "Error Occured",
        error: err,
      });
    });
});

AuthRouter.post("/login", async (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password)
    return res.send({
      status: 400,
      message: "Missing Credentials",
    });

  try {
    const userDb = await User.loginUser({ loginId, password });

    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id,
      username: userDb.username,
      email: userDb.email,
    };

    return res.send({
      status: 200,
      message: "Login Successfully",
      data: userDb,
    });
  } catch (error) {
    return res.send({
      status: 400,
      error: error,
    });
  }
});

AuthRouter.post("/logout", isAuth, (req, res) => {
  const user = req.session.user;

  req.session.destroy((error) => {
    if (error)
      return res.send({
        status: 400,
        message: "Logout Unsuccessfull",
        error: error,
      });

    return res.send({
      status: 200,
      message: "Logout Successfully",
      data: user,
    });
  });
});

module.exports = AuthRouter;
