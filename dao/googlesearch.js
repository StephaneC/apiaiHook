var https = require('https');
var conf = require('../env.json');
var apiHelper = require('../apiaiHelper.js');


var url = 'https://www.googleapis.com/customsearch/v1?;'
var paramSearch ="&q=";
var paramKey ="&Key=";
var paramSearchId ="&cx=";

var search = function(search, callback){
  console.log("Search : "+createUrl(search));
  https.get(createUrl(search), function(res){
    const statusCode = res.statusCode;
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
};

var createSpeech = function(data){
  var speech = 'Hey, j\'ai trouvé ' + data.items.length + ' articles. Le plus intéressant semble : '
              + data.items[0].title + ' accessible ici : ' + data.items[0].link;
              
  return speech;
}

var createUrl = function(search){
  return 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAG0wRblBH7_t9NqRy3tBbTK3ATBc16_Bc&cx=017745782665453603834:tx9x_hgx5ku&q=livret%20A';/*
  return url + paramKey + conf.google.apiKey
      + paramSearchId + conf.google.customSearchId
      + paramSearch + encodeURIComponent(search);*/
}

module.exports = {
  search : search
};