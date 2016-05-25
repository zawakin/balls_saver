var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var fs = require("fs");

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


app.set("port", 8000);
app.use(express.static("balls"));
app.get("/", function (req, res) {
    res.sendFile("index.html");
});

app.post("/", function(req,res){
    res.send(load_data_array(res));
});

function save_data_array(ws,sdatas){
    ws.write(JSON.stringify(sdatas));
    ws.end();
}

function load_data_array(){
  var res = fs.readFileSync("hoge.txt","utf-8")
  return res;
}

var sdatas = [];
  io.on("connection", function(socket){
    console.log("new socket connected.");

    socket.on("send_start", function(){
        sdatas = [];
    });
    socket.on("send_data", function(sdata){
      data = JSON.parse(sdata);
      sdatas.push(sdata);
    });

    save_ended = false;
    socket.on("save_end", function(some_obj){
      if(!save_ended){
        var ws = fs.createWriteStream("hoge.txt");
        save_data_array(ws,sdatas);
        save_ended = true;
        console.log("saving successfully.");
      }
    });

    socket.on("load_request",function(some_obj){
      console.log("load request received.");
      socket.emit("load_data", load_data_array());
      console.log("alldata sent.");
    });
  });

http.listen(app.get("port"), function () {
    console.log("port = %s", app.get("port"));
});
