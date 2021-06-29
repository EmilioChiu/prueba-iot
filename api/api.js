const express = require("express");
const cors = require("cors");
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/hum-tempDB', {useNewUrlParser: true, useUnifiedTopology: true});

const humTempSchema = new mongoose.Schema({type: String,date: Date, data: Number});
const HumOrTemp = mongoose.model("Data", humTempSchema)

app.use(cors());

app.get("/getDataAfterDate/:date/:type", function(req, res){
  const type = req.params.type
  const date = req.params.date
  HumOrTemp.find({type: type, date:{ $gte: new Date(date) }}, function(err, data){
    if (err){
      console.log(err);
    }else{
      console.log("now: " + new Date().toUTCString() + "date requested: " + new Date(date));
      res.send(data);
    }
  });
});

app.post("/post-new-data/:type/:value", function(req, res){
  var now = new Date();
  var sensor = req.params.type;
  var value = req.params.value;
  const humOrTemp = new HumOrTemp({type: sensor, date: now, data: value});
  humOrTemp.save(function(err){
    if(err){
      res.send(err);
    }
    else{
      res.send("posted!" + new Date(now));
    }
  });
});

app.delete("/delete-old-data", function(req, res){
  var fiveHoursAgo = new Date();
  const limitTime = fiveHoursAgo.setHours(fiveHoursAgo.getHours()-5);
  HumOrTemp.deleteMany({date:{$lte: new Date(limitTime)}}, function(err, dates){
    if (err){
      res.send(err);
    }
    else{
      res.send("old data deleted");
    }
  });
});

app.listen(300, function(){
  console.log("running in 300")
})
