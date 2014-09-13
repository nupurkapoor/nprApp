/* Service to manage the audio element, the $document service gives access to the JS root object window.document*/
app.factory('audio', function($document) {
  var audio = $document[0].createElement('audio');
  return audio;
});
