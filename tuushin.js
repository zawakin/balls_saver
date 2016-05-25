var socket = io();
var loaded = false;
var sdatas;

socket.on("greeting",function(greeting){
  console.log(greeting);
  socket.emit("load_request",{});
  console.log("### load_request");
});
