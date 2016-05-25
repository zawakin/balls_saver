var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var fs = require("fs");

app.set("port", 8000);
app.use(express.static("balls"));
app.get("/", function (req, res) {
    res.sendFile("index.html");
});

function save_data_array(ws,sdatas){
    ws.write(JSON.stringify(sdatas));
    ws.end();
}

function load_data_array(){
  var res = fs.readFileSync("hoge.txt","utf-8")

  // (err, text){
  //   res = text;
  //   console.log("1" + err);
  //   console.log("2" + text);
  //   console.log("3" + res);
  // });
  // console.log("4" + res);
  // console.log(res);
  return res;

}

var sdatas = [];
  io.on("connection", function(socket){
    socket.emit("greeting","hello");
    console.log("new socket connected.");

    socket.on("send_data", function(sdata){
      // console.log(data.mouse + " " + data.keyCode1.);
      data = JSON.parse(sdata);
      sdatas.push(sdata);
      var keyCode1 = data.k1;
      // console.log(keyCode1.length + " " + data.mouse.x + " " + data.mouse.y);
    });

    save_ended = false;
    socket.on("save_end", function(some_obj){
      if(!save_ended){
        var ws = fs.createWriteStream("hoge.txt");
        save_data_array(ws,sdatas);
        save_ended = true;
        console.log("saving successfully.");
        stext = load_data_array();
        console.log("load_data sent.")
        socket.emit("load_data", stext);
      }
    });

    socket.on("load_request",function(some_obj){
      console.log("got load_request.");
      socket.emit("load_data", load_data_array());
      console.log("send data.");
    });


  });



http.listen(app.get("port"), function () {
    console.log("port = %s", app.get("port"));
});
