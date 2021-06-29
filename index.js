const axios = require("axios");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {cors: {origin: ["http://localhost:3000"],}});



io.on("connect", function(socket){

  socket.on("iot/sensors", function(arg){
    var type = arg.sensor;
    var value = arg.value;
    axios.post('http://localhost:300/post-new-data/' + type + '/' + value)
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      console.error(error);
    })
    axios.delete("http://localhost:300/delete-old-data")
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      console.log(error);
    })
  });
});


server.listen(3000, function(){
  console.log("server running...");
});
