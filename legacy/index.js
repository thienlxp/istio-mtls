const http = require("http");

console.log("server started at :8080");

http
  .createServer(function (req, res) {
    console.log("headers", req.headers);

    res.write("Legacy\n");
    res.end();
  })
  .listen(8080);
