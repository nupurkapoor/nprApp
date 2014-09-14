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