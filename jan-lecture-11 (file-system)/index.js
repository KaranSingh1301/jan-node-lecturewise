const http = require("http");
const fs = require("fs");
const formidable = require("formidable");
const { runInNewContext } = require("vm");

const server = http.createServer();

// server.on("request", (req, res) => {
//   console.log(req.method, " ", req.url);
//   const dataString = "hello karan";
//   //read
//   if (req.method === "GET" && req.url === "/") {
//     fs.readFile("newDemo2.txt", (err, data) => {
//       // console.log(data);
//       res.write(data);
//       return res.end();
//     });
//   }
//   //write
//   else if (req.method === "GET" && req.url === "/append") {
//     //appendFile
//     fs.appendFile("demo1.txt", dataString, (err, data) => {
//       if (err) throw err;
//       console.log("saved");
//       return res.end("Appended!");
//     });
//   } else if (req.method === "GET" && req.url === "/write") {
//     //WriteFile
//     fs.writeFile("demo2.txt", dataString, (err, data) => {
//       if (err) throw err;
//       console.log("saved");
//       return res.end("WriteFile");
//     });
//   }

//   //deletefile
//   else if (req.method === "GET" && req.url === "/delete") {
//     fs.unlink("demo1.txt", (err) => {
//       if (err) throw err;
//       return res.end("Deleted!");
//     });
//   }
//   //rename
//   else if (req.method === "GET" && req.url === "/rename") {
//     fs.rename("demo2.txt", "newDemo2.txt", (err) => {
//       if (err) throw err;
//       return res.end("Renamed!");
//     });
//   }
// });

//create a stream to read file
// server.on("request", (req, res) => {
//   const rStrem = fs.createReadStream("newDemo2.txt");

//   rStrem.on("data", (char) => {
//     // console.log(char);
//     res.write(char);
//   });

//   rStrem.on("end", () => {
//     res.end();
//   });
// });

//upload a file

server.on("request", (req, res) => {
  if (req.url === "/fileupload") {
    let form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
      console.log(files);
      const oldPath = files.filetoupload.filepath;
      // const newPath = "/uploads"
      // console.log(files.filetoupload.originalFilename);
      // console.log(__dirname);

      const newPath =
        __dirname + "/uploads/" + files.filetoupload.originalFilename;
      console.log(oldPath);
      console.log(newPath);

      fs.rename(oldPath, newPath, (err) => {
        if (err) throw err;
        res.write("File uploaded Success");
        return res.end();
      });
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(
      '<form action="fileupload" method="post" enctype="multipart/form-data">'
    );
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write("</form>");
    return res.end();
  }
});

server.listen(8000, () => {
  console.log("server is running on PORT 8000");
});
