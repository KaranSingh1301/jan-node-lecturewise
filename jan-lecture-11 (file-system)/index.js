const http = require("http");
const fs = require("fs");
const formidable = require("formidable");

const server = http.createServer();

server.on("request", (req, res) => {
  console.log(req.method, " ", req.url);

  //read
  if (req.method === "GET" && req.url === "/") {
    fs.readFile("test.html", (err, data) => {
      // console.log(data);
      res.write(data);
      return res.end();
    });
  }
  //write
  else if (req.method === "GET" && req.url === "/append") {
    const dataString = " Hello Nodejs Class";
    //appendFile
    fs.appendFile("demo1.txt", dataString, (err, data) => {
      if (err) throw err;
      console.log("saved");
      return res.end("Appended!");
    });
  }
});

server.listen(8000, () => {
  console.log("server is running on PORT 8000");
});
