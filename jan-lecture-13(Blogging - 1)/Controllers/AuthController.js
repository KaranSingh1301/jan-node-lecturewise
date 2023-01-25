const express = require("express");
const cleanUpAndValidate = require("../utils/AuthUtils");
const AuthRouter = express.Router();
const User = require("../Schemas/User");

AuthRouter.post("/register", (req, res) => {
  const { email, password, username, name } = req.body;
  cleanUpAndValidate({ name, email, password, username })
    .then(async () => {
      const user = new User({
        name: name,
        email: email,
        password: password,
        username: username,
      });

      try {
        const userDb = await user.save();
        console.log(userDb);

        req.session.isAuth = true;

        return res.send({
          status: 200,
          message: "User is registered",
          data: userDb,
        });
      } catch (err) {
        console.log(err);
        return res.send({
          status: 400,
          message: "Database Error, Please try again",
          error: err,
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

AuthRouter.post("/login", (req, res) => {
  console.log("login");
  return res.send({
    status: 200,
  });
});

module.exports = AuthRouter;
