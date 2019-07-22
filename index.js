const _eval = require("eval");
const express = require("express");
const WebSocket = require("ws");
const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ port: 40510 });
const app = express();
const robot = require("robotjs");

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendfile(__dirname + "/public/index.html");
});
app.listen(3000, function() {
  console.log("Example app listening on port http://localhost:3000!");
});

wss.on("connection", function(ws) {
  ws.on("message", function(message) {
    // dovremmo usare _eval in modo tale da eseguire in sandbox
    // dobbiamo pero' trovare un modo per importare la libreria robot
    // _eval(message);
    eval(message);
  });
});
