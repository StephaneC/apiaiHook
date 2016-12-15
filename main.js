var weatherApi = require('./dao/openweathermap.js');

var express = require('express');
var app = express();

var http = require('http').Server(app);

app.get('/apiwebhook', function(req, res){
  //check authentication
    weatherApi.getCurrentWeather('paris', function(re){
    console.log("result "+re);
    res.send(re);
  });
});

app.get('/time', function(req, res){
  //check authentication
  res.send(JSON.stringify(new Date()));
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
