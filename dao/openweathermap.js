var http = require('http');
var conf = require('../env.json');
var apiHelper = require('../apiaiHelper.js');

var baseUrl = 'http://api.openweathermap.org/data/2.5';


var createWheaterURL = function(city){
  console.log(baseUrl + '/weather?units=metric&lang=fr&q='+city+"&APPID="+conf.openweathermap.apiKey);
  return baseUrl + '/weather?units=metric&lang=fr&q='+city+"&APPID="+conf.openweathermap.apiKey;
}

var getCurrentWeather = function(city, callback){
  console.log(JSON.stringify(conf));
  if(!conf.openweathermap.apiKey){
    	throw new Error('Please add openweathermap apiKey to conf file!');
  }
  http.get(createWheaterURL(city), function(res){
    const statusCode = res.statusCode;
    console.log("Weather api - status code: " + statusCode);
    if(statusCode != 200){
      var error = apiHelper.createError(statusCode, 'Une erreur est survenue. Merci de ré-essayer!');
      if(callback){
        callback(error);
      }
      return error;
    }
    var rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
      try {
        var parsedData = JSON.parse(rawData);
        parsedData.speech = createSpeech(parsedData);
        console.log(parsedData.speech);
        if(callback){
          callback(parsedData);
        }
        return parsedData;
      } catch (e){
        console.log(e);
        var error = apiHelper.createError(statusCode, 'Une erreur est survenue. Merci de ré-essayer!');
        if(callback){
          callback(error);
        }
        return error;
      }
    });
  }).on("error", function(e){
    console.log("Got error: " + e.message);
    var error = apiHelper.createError(statusCode, 'Une erreur est survenue. Merci de ré-essayer!');
    return error;
    });
}

var createSpeech = function(data){
  var speech = 'Le temps à ' + data.name + ' est ' + data.weather[0].description
              + ' La température est de ' + data.main.temp + '°C.';
  return speech;
}



module.exports = {
  getCurrentWeather : getCurrentWeather

};
