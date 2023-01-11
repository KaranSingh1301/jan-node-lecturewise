const express = require("express");

const app = express();

app.get("/", (req, res) => {
  return res.send("This is my serverss");
});

app.listen(8000, () => {
  console.log("listenning on porttttt 8000");
});
