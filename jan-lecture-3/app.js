const express = require("express");

const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  console.log("I am a express server");
  //   console.log(req);
  return res.send("This is your server");
});

//post route
app.post("/myapp", (req, res) => {
  console.log("This is my post route");
  return res.send("all worked fined");
});

//query
app.get("/myapp", (req, res) => {
  //"/myapp?key=value"
  console.log(req.query);
  //console.log(req.query.key1.split(","));
  //   const { key1, key2 } = req.query;
  //   console.log(key1, key2);
  return res.send("This is myapp route");
});

//dynamic routing
// app.get("/api/:id", (req, res) => {
//   console.log(req.params);
//   const id = req.params.id;
//   return res.send(`This is my +${id}+ dynamic route`);
// });

// app.get("/api/:id/:name", (req, res) => {
//   console.log(req.params);
//   const { id, name } = req.params;
//   //return res.send("multilevel dynamic route");
//   return res.send(`your route is : api/${id}/${name}`);
// });

// app.get("/api/:id/profile/:name", (req, res) => {
//   console.log(req.params);
//   const { id, name } = req.params;
//   //return res.send("multilevel dynamic route");
//   return res.send(`your route is : api/${id}/profile/${name}`);
// });

app.get("/api/mix/:id", (req, res) => {
  console.log(req.query, req.params);

  return res.send("all ok");
});

app.get("/myhtml", (req, res) => {
  return res.send(`
    <html>
    <head></head>
    <body>
        <p>My form</p>
        <input> </input>
        <button > Submit </button>
    </body>
    </html>
    `);
});

app.listen(PORT, () => {
  console.log(`server is on port ${PORT}`);
});
