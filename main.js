var weatherApi = require('./dao/openweathermap.js');
var searchApi = require('./dao/googlesearch.js');
var apiHelper = require('./apiaiHelper.js');
var alexaHelper = require('./alexaHelper.js');


var bodyParser = require('body-parser')
var express = require('express');
var app = express();

var http = require('http').Server(app);
var myApiKey = "MyAuthenticationTokenIsHereAndIWillFoundABetterLater";

/** understand JSON in body. */
app.use(bodyParser.json());
app.get('/alexahook', function(req, res){
  console.log('Received alexahook');
  var request = req.body;
  switch(request.request.type){
    case 'LaunchRequest':
    //TODO
    var response = alexaHelper.createResponse('bonjour', 'bonjour', data, 'Crédit Mutuel Arkéa');
    res.send(response);
    break;
    case 'IntentRequest':
      switch (request.request.intent.name) {
        case 'HorlogeParlante':
        console.log("action.time");
          var date = new Date();
          var data = {};
          var speech =  'Il est ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ' et ' + date.getUTCSeconds() + " secondes.";
          var response = alexaHelper.createResponse(speech, speech, data, 'Crédit Mutuel Arkéa');
          res.send(response);
        break;
        default:
        var response = alexaHelper.createResponse('bonjour', 'bonjour', data, 'Crédit Mutuel Arkéa');
        res.send(response);
        break;
      }
    break;
    case 'SessionEndedRequest':
    //TODO
    var response = alexaHelper.createResponse('bonjour', 'bonjour', data, 'Crédit Mutuel Arkéa');
    res.send(response);
    break;
  }
});
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
              console.log("action.weather - result: "+ JSON.stringify(result));
              res.send(result);
            });
          } else {
            var txt = 'Nous n\'avons pas compris l\'endroit où vous souhaitez connaitre le temps.';
            var err = apiHelper.createError(500, txt);
            res.send(err);
          }
          break;
        case 'action.time':
            console.log("action.time");
            getTime(function(result){
              console.log("action.time - result: "+ JSON.stringify(result));
              res.send(result);
            });
            break;
        default:
          console.log("action default");
          searchApi.search(request.result.resolvedQuery, function(result){
            console.log("default search - result: "+ JSON.stringify(result));
            res.send(result);
          });
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
  var data = {};
  var speech =  'Il est ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ' et ' + date.getUTCSeconds() + " secondes.";
  var response = apiHelper.createResponse(speech, speech, data, 'Crédit Mutuel Arkéa');
  cb(response);
}
