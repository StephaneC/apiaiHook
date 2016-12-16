module.exports = {
  createError : createError,
  createResponse : createResponse
};

var defaultSource = 'Crédit Mutuel Arkéa';

var createError = function(statusCode, message){
  var response = {
    speech : message,
    displayText: message,
    data: {
      statusCode: statusCode,
      message : message
    },
    source:defaultSource
  };
};

var createResponse = function(speech, message, data, source){
  var response = {
    speech : speech,
    displayText: message,
    data: data,
    source:source
  };
  if(!source){
    response.source = defaultSource;
  }

  return response;
};
