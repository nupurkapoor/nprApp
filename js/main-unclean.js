var app = angular.module('nprApp' , []); //new module

var apiKey = 'MDE2NjgxODUzMDE0MTA0MDg1MDUxZGVhMA001',
    nprUrl = 'http://api.npr.org/query?id=61&fields=relatedLink,title,byline,text,audio,image,pullQuote,all&output=JSON';


app.directive('nkNprLink', function() {
  return {
    restrict: 'AE',
    require: ['^ngModel'],
    replace: true,
    scope: {
      ngModel: '=',
      player: '=' //player service
    },
    templateUrl: 'views/nprListItem.html',
    link: function(scope, ele, attr) {
      scope.duration = scope.ngModel.audio[0].duration.$text;
    }
  }
});

/* Service to manage the audio element, the $document service gives access to the JS root object window.document*/
app.factory('audio' , ['$document', function($document){
  var audio = $document[0].createElement('audio');
  return audio;
}]);

/*Service to maange playback feathures and functionalities of the listing*/
app.factory('player', ['$rootScope', 'audio', function($rootScope, audio) {
  var player = {
    playing: false,
    current: null,
    ready: false,

    play: function(program) {
      // If playing, stop the current playback
      if (player.playing) player.stop();
      var url = program.audio[0].format.mp4.$text; // from the npr API
      player.current = program; // Store the current program
      audio.src = url;
      audio.play(); // Start playback of the url
      player.playing = true
    },
    stop: function() {
      if (player.playing) {
        audio.pause(); // stop the current playback
        // Clear the state of the player
        player.ready = player.playing = false; 
        player.current = null;
      }
    },
  currentTime: function() {
      return audio.currentTime;
  },
  currentDuration: function() {
    return audio.duration;
  }
};
/*
  ALERT!!! Okay so why $rootScope in following functions? Because we'll be using this service 
  in different controllers and therefore different scopes. So this way by injecting the 
  $rootScope to the service and calling $apply on it we can avoid worrying about which scopes 
  the service will be used in the future. 
  Tada... found a valid $rootScope usecase!
*/

  audio.addEventListener('canplay', function(evt) {
    $rootScope.$apply(function() {
      player.ready = true;
    });
  });

/* 
  timeupdate is a default event for audio element which fires continually while the media is playing.
*/
  audio.addEventListener('timeupdate', function(evt) {
    $rootScope.$apply(function() {
      player.progress = player.currentTime();
      player.progress_percent = player.progress / player.currentDuration();
    });
  });

  audio.addEventListener('ended' , function(){
    $rootScope.$apply(player.stop());
  });

  return player;
}]);


app.controller('PlayerController', ['$scope', '$http', 'player', 
  function($scope, $http, player) {

  $http({
    method: 'JSONP',
    url: nprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
  }).success(function(data, status) {
    $scope.programs = data.list.story;
  }).error(function(data, status) {
    alert("Sorry couldnt get the listings! womp womp");
  });

  /*Audio service not specifically referenced since the player service will manage the audio.*/
  $scope.audio = audio; 


  $scope.play = function(program) {

    if ($scope.playing) {
      audio.pause();
      $scope.playing = false;
    }else{
      var url = program.audio[0].format.mp4.$text; //NPR API specific syntax
      audio.src = url;
      audio.play();
      $scope.playing = true; //state of the player.
    }
    
  };

  $scope.stop = function() {
    audio.pause(); //how??
    $scope.playing = false;
  };

  $scope.audio.addEventListener('ended', function(){
    $scope.$apply(function(){
      $scope.stop();
    });
  });
}]);

app.controller('RelatedController', ['$scope', function($scope) {
  /* 
    Will be responsible for keeping track of our audio element and will handle fetching our 
    listing of NPR programs. 
    
  */


}]);

app.controller('FrameController', function($scope) {
  //Parent Scope
});

