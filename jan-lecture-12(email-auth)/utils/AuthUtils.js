const validator = require("validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cleanUpAndValidate = ({ name, email, password, username }) => {
  return new Promise((resolve, reject) => {
    if (!email || !password || !username) reject("Missing Parameters");

    if (typeof email !== "string") reject("Invalid Email");
    if (typeof name !== "string") reject("Invalid Name");
    if (typeof password !== "string") reject("Invalid Password");
    if (typeof username !== "string") reject("Invalid Username");

    if (!validator.isEmail(email)) reject("Invalid Email Format");

    if (username.length <= 2 || username.length > 49)
      reject("Username lenght should be 3 to 49 char");
    if (password.length < 4) reject("Password too short");
    if (password.length > 100) reject("Password is too long");

    resolve();
  });
};

const generateJWTToken = (email) => {
  const JWT_TOKEN = jwt.sign({ email: email }, "this is jan nodejs class", {
    expiresIn: "15d",
  });

  return JWT_TOKEN;
};

const sendVerificationEmail = (email, verficationtoken) => {
  console.log(email, verficationtoken);

  let mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
      user: "kssinghkaran13@gmail.com",
      pass: "GenerateYourOwnPassword Or use new account",
    },
  });

  let mailOptions = {
    from: "Todo App Pvt lt",
    to: email,
    subject: "Email verfication fror Todo App",
    html: `click <a href="http://localhost:8000/verify/${verficationtoken}" >Here</a>`,
  };

  mailer.sendMail(mailOptions, function (err, resposne) {
    if (err) throw err;
    else console.log("Mail has been sent successfully");
  });
};

module.exports = {
  cleanUpAndValidate,
  generateJWTToken,
  sendVerificationEmail,
};
