const userSchema = require("../Schemas/User");
const bcrypt = require("bcrypt");
const validator = require("validator");
const ObjectId = require("mongodb").ObjectId;

let User = class {
  username;
  email;
  name;
  password;

  constructor({ username, email, password, name }) {
    this.email = email;
    this.name = name;
    this.username = username;
    this.password = password;
  }

  static verifyUserId({ userId }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!ObjectId.isValid(userId)) {
          reject("Invalid userId");
        }

        const userDb = await userSchema.findOne({ _id: ObjectId(userId) });
        if (!userDb) {
          reject("No user found");
        }

        resolve(userDb);
      } catch (err) {
        reject(err);
      }
    });
  }

  static verifyUsernameAndEmailExits({ username, email }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDb = await userSchema.findOne({
          $or: [{ username }, { email }],
        });

        console.log(userDb);

        if (userDb && userDb.email === email) {
          return reject("Email already exists.");
        }
        if (userDb && userDb.username === username) {
          return reject("Username already exists.");
        }

        return resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      const hashedPassword = await bcrypt.hash(this.password, 12);

      //created an object for userSchema
      const user = new userSchema({
        username: this.username,
        email: this.email,
        name: this.name,
        password: hashedPassword,
      });

      try {
        const userDb = await user.save();
        return resolve(userDb);
      } catch (error) {
        return reject(error);
      }
    });
  }

  static loginUser({ loginId, password }) {
    return new Promise(async (resolve, reject) => {
      const userDb = await userSchema.findOne({
        $or: [{ username: loginId }, { email: loginId }],
      });

      if (!userDb) {
        return reject("No user Found");
      }

      //match password
      const isMatch = await bcrypt.compare(password, userDb.password);

      if (!isMatch) {
        return reject("Password do not matched");
      }

      return resolve(userDb);
    });
  }
};

module.exports = User;

//mongoose.schema <-----> UserSchema <-----> User <----> Controller
