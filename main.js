var weatherApi = require('./dao/openweathermap.js');

var express = require('express');
var app = express();

var http = require('http').Server(app);
var myApiKey = "MyAuthenticationTokenIsHereAndIWillFoundABetterLater";

app.post('/apiwebhook', function(req, res){
  //check authentication
  if(req.header('token', null) != myApiKey){
    console.log("token inccorect : " + req.headers('token'))
    res.statusCode = 401;
    res.send('error');
  } else {
    console.log("apiwebhook "+ req.body);
    //TODO router
      weatherApi.getCurrentWeather('paris', function(re){
        console.log("Data received by weatherMap : " + JSON.stringify(re));
        var response = {
          speech : re.speech,
          displayText: re.speech,
          data: re,
          source: 'Crédit Mutuel Arkéa',
        };
      console.log("result "+re);
      res.send(response);
    });
  }
});

app.post('/apiwebhook', function(req, res){
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
