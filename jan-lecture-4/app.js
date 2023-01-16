const express = require("express");
const mongoose = require("mongoose");
const userSchema = require("./userSchema");

//file imports

const app = express();
const PORT = process.env.PORT || 8000;

const mongoURI = `mongodb+srv://karan:12345@cluster0.3ije6wh.mongodb.net/demo1`;

mongoose.set("strictQuery", false);
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("Connected to DB successfully");
  })
  .catch((err) => {
    console.log(err);
  });

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//param, query
app.get("/", (req, res) => {
  console.log("I am a express server");
  //   console.log(req);
  return res.send("This is your server");
});

//post route
//body, query, params
app.post("/api", (req, res) => {
  console.log(req.body);
  return res.send({
    status: 200,
    message: "User is created",
    data: req.body,
  });
});

app.get("/form", (req, res) => {
  return res.send(`
    <html>
    <head></head>
    <body>
    <h3>My form<h3>
    <form action="/submit_form" method="POST">

      <label for="name" >Name</label>
      <input type="text" name="name" ></input>

      <label for="email" >Email</label>
      <input type="text" name="email" ></input>

      <label for="password" >Password</label>
      <input type="text" name="password" ></input>

      <button type="submit">Submit</button>

    </form>
    
    </body>
    </html>
  `);
});

app.post("/submit_form", async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  //create a user in db
  //{ name: 'sss', email: 'ssss', password: 'sssss' }
  let user = new userSchema({
    name: name,
    email: email,
    password: password,
  });

  try {
    const userDb = await user.save();
    console.log(userDb);

    return res.send({
      status: 200,
      message: "User created successfully",
      data: userDb,
    });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Error occured",
      error: error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`server is on port ${PORT}`);
});
