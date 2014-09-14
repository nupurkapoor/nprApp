/* sole purpose of this service is to make requests */

app.factory('nprService', function($http) {
    var doRequest = function(apiKey) {
      return $http({
        method: 'JSONP',
        url: nprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
      });
    }

    return {
      programs: function(apiKey) { return doRequest(apiKey); }
    };
  });