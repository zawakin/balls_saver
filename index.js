var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var fs = require("fs");

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
  limit: "50mb"
}));
// app.use(express.limit('10mb'));

app.set("port", 8000);
app.use(express.static("balls"));
app.get("/", function (req, res) {
    res.sendFile("index.html");
});

app.post("/", function(req,res){
    var logfile;
    console.log(req.body.logfile);
    if(req.body.logfile==undefined){
        console.log("requested log :" + req.body.logfile);
        console.log("sending requested log...");
        logfile = req.body.logfile;
    }else{
        var log_list = fs.readdirSync("log");
        logfile = log_list[log_list.length-1];
        console.log("latest log :" + logfile);
        console.log("latest log sending...");
    }
    res.send(load_data_array("log/" + logfile));
});

app.post("/saveDR", function(req,res){
    var data_to_write = req.body.sdatas;
    var filename = "log/DR_" + get_timestamp() + ".txt"
    fs.writeFile(filename, data_to_write, function(err){
        if(err != null){
            console.log(err);
        }else{
            console.log("writing to " + filename + " successfully");
        }
    });
    res.send("ok");
});

function save_data_array(ws,sdatas){
    ws.write(JSON.stringify(sdatas));
    ws.end();
}

function load_data_array(alogname){
  var res = fs.readFileSync(alogname,"utf-8");
  return res;
}

function get_timestamp(){
    var d = new Date();
    var year  = d.getFullYear();
    var month = d.getMonth() + 1;
    var day   = d.getDate();
    var hour  = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
    var min   = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
    var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
    return year + '_' + month + "_" + day + "_" + hour + "_" + min + "_" + sec;
}

  io.on("connection", function(socket){
    console.log("new socket connected.");

    var sdatas = [];
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
        var data_to_write = JSON.stringify(sdatas);
        fs.writeFile("log/" + get_timestamp() + ".txt", data_to_write, function(err){
            if(err != null) console.log(err);
        });
        save_ended = true;
        console.log("saving successfully.");
      }
    });
  });

http.listen(app.get("port"), function () {
    console.log("port = %s", app.get("port"));
});
