var weatherApi = require('./dao/openweathermap.js');
var apiHelper = require('./apiaiHelper.js');

var bodyParser = require('body-parser')
var express = require('express');
var app = express();

var http = require('http').Server(app);
var myApiKey = "MyAuthenticationTokenIsHereAndIWillFoundABetterLater";

/** understand JSON in body. */
app.use(bodyParser.json());

app.post('/apiwebhook', function(req, res){
  //check authentication
  if(req.header('token', null) != myApiKey){
    console.log("token inccorect : " + req.headers('token'));
    res.statusCode = 401;
    res.send('error');
  } else {
    console.log("apiwebhook "+ JSON.stringify(req.body));
    var request = req.body;
    if(request.result){
      switch (request.result.action) {
        case 'action.weather':
          if(request.result.parameters && request.result.parameters['geo-city']){
            cityWeather(request.result.parameters['geo-city'], function(result){
              res.send(result);
            });
          } else {
            var txt = 'Nous n\'avons pas compris l\'endroit où vous souhaitez connaitre le temps.';
            var err = apiHelper.createError(500, txt);
            res.send(err);
          }
          break;
          case 'action.time':
            getTime(function(result){
              res.send(result);
            });
            break;
        default:
          var txt = 'Nous n\'avons pas compris votre question. Que vouliez vous dire?';
          var err = apiHelper.createError(500, txt);
          res.send(err);
          break;
      }
    } else {
      var txt = 'Nous n\'avons pas compris votre question. Que vouliez vous dire?';
      var err = apiHelper.createError(500, txt);
      res.send(err);
    }
  }
});


app.get('/time', function(req, res){
  //check authentication
  res.send(JSON.stringify(new Date()));
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});


var cityWeather = function(location, cb){
  weatherApi.getCurrentWeather(location, function(re){
    var response = apiHelper.createResponse(re.speech, re.speech, re, 'OpenweatherMap');
    cb(response);
  });
}

var getTime = function(cb){
  var date = new Date();
  var speech =  'Il est ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ' et ' + date.getUTCSeconds() + " secondes.";
  var response = apiHelper.createResponse(speech, speech, date);
  cb(response);
}
