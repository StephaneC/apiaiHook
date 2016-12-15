var http = require('http');
var conf = require('../env.json');

var baseUrl = 'http://api.openweathermap.org/data/2.5';


var createWheaterURL = function(city){
  console.log(baseUrl + '/weather?&lang=fr&q='+city+"&APPID="+conf.openweathermap.apiKey);
  return baseUrl + '/weather?&lang=fr&q='+city+"&APPID="+conf.openweathermap.apiKey;
}

var getCurrentWeather = function(city, callback){
  console.log(JSON.stringify(conf));
  if(!conf.openweathermap.apiKey){
    	throw new Error('Please add openweathermap apiKey to conf file!');
  }
  http.get(createWheaterURL(city), function(res){
    const statusCode = res.statusCode;
    console.log("Weather api - status code: "+statusCode);
    var error = {};
    if(statusCode != 200){
      error.statusCode = statusCode;
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
        console.log(parsedData);
        if(callback){
          callback(parsedData);
        }
        return parsedData;
      } catch (e){
        console.log(e);
        var err = {};
        err.statusCode = statusCode;
        err.msg = e;
        if(callback){
          callback(err);
        }
        return err;
      }
    });
  }).on("error", function(e){
    console.log("Got error: " + e.message);
    var err = {};
    err.statusCode = statusCode;
    err.msg = e;
    return err;
    });
}

module.exports = {
  getCurrentWeather : getCurrentWeather

};
