var app = angular.module('nprApp' , []); //new module

var apiKey = 'MDE2NjgxODUzMDE0MTA0MDg1MDUxZGVhMA001',
    nprUrl = 'http://api.npr.org/query?id=61&fields=relatedLink,title,byline,text,audio,image,pullQuote,all&output=JSON';

app.directive('nprLink', function() {
  return {
    restrict: 'EA',
    require: ['^ngModel'],
    replace: true,
    scope: {
      ngModel: '=',
      player: '='
    },
    templateUrl: 'views/nprListItem.html',
    link: function(scope, ele, attr) {
      scope.duration = scope.ngModel.audio[0].duration.$text;
    }
  }
});

app.directive('playerView', [function(){
  
  return {
    restrict: 'EA',
    require: ['^ngModel'],
    scope: {
      ngModel: '='
    },
    templateUrl: 'views/playerView.html',
    link: function(scope, iElm, iAttrs, controller) {
      scope.$watch('ngModel.current', function(newVal) {
        if (newVal) {
          scope.playing = true;
          scope.title = scope.ngModel.current.title.$text;
          scope.$watch('ngModel.ready', function(newVal) {
            if (newVal) {
              scope.duration = scope.ngModel.currentDuration();
            }
          });

          scope.$watch('ngModel.progress', function(newVal) {
            scope.secondsProgress = scope.ngModel.progress;
            scope.percentComplete = scope.ngModel.progress_percent;
          });
        }
      });
      scope.stop = function() {
        scope.ngModel.stop();
        scope.playing = false;
      }
    }
  };
}]);

/* Service to manage the audio element, the $document service gives access to the JS root object window.document*/
app.factory('audio', function($document) {
  var audio = $document[0].createElement('audio');
  return audio;
});

/*Service to maange playback features and functionalities of the listing*/
app.factory('player', function(audio, $rootScope) {
  var player = {

    current: null,
    progress: 0,
    playing: false,
    ready: false,

    // If playing, stop the current playback
    play: function(program) {
      if (player.playing) player.stop();

      var url = program.audio[0].format.mp4.$text;
      player.current = program;
      audio.src = url;
      audio.play();
      player.playing = true;
    },
    stop: function() {
      if (player.playing) {
        audio.pause();  // stop the current playback
        // Clear the state of the player
        player.playing = false;
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

  audio.addEventListener('ended', function() {
    $rootScope.$apply(player.stop());
  });
  return player;

});

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

app.controller('PlayerController', function($scope, nprService, player) {
  $scope.player = player;
  nprService.programs(apiKey)
    .success(function(data, status) {
      $scope.programs = data.list.story;
    })
});

app.controller('RelatedController', function($scope, player) {
  $scope.player = player;

  $scope.$watch('player.current', function(newVal) {
    if (newVal) {
      $scope.related = [];
      angular.forEach(newVal.relatedLink, function(link) {
        $scope.related.push({link: link.link[0].$text, caption: link.caption.$text});
      });
    }
  });
});


app.controller('FrameController', function($scope) {
  // Parent scope
});

