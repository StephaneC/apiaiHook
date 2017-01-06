var defaultSource = 'Crédit Mutuel Arkéa';

var createError = function(statusCode, message){
  var response = {
    type : 'SSML',
    ssml: '<speak>'+message+'</speak>'
  };
  return response;
};

var createResponse = function(speech, message, data, source){
  var response = {
    type : 'SSML',
    ssml: '<speak>'+message+'</speak>',
    data: data
  };
  return response;
};

module.exports = {
  createError : createError,
  createResponse : createResponse
};
