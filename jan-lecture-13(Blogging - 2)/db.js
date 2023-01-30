const mongoose = require("mongoose");
const clc = require("cli-color");

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => {
    console.log(clc.yellow("MongoDb connected"));
  })
  .catch((err) => {
    console.log(clc.red(err));
  });
