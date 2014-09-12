/*  
  Once we get to our javascript code, how do we tell Angular where our angular app is? 
  To define an AngularJS app we need to define it using the angular.module() API. 
  An angular module is a collection of fns in module ng taht are run when the Angular app is booted. 
  It is a global space for creating, registering and retreiving Angular modules. 
  There are two main operations when dealing with a module:

  1. creating a new module (i.e. the “setter”) or
  2. getting a reference to an existing module (i.e. the “getter”)

  A $scope is an object that ties a view (a DOM element) to the controller. 
  In the Model-View-Controller structure, this $scope object becomes the model. 
  It provides an execution context that is bound to the DOM element (and its children).
  $scope is just a JavaScript object. Both the controller and the view have access to the $scope 
  so it can be used for communication between the two. This $scope object will house both the data 
  and the functions that we’ll want to run in the view. Anything that we attach to this 
  $scope object will become available to the view. Likewise, any changes that the controller 
  makes to the model will show up as changes in the view.

  Every controller creates a scope for itself. So, texplicitly create a $scope object, 
  we’ll attach a controller object to a DOM element using the ng-controller directive on an object.

  Both below mentioned controllers would set up a $scope that we would be able to access 
  from inside the DOM element. We can access the object in any child element of the div 
  where ng-controller='PlayerController' or ng-controller='RelatedController' is written 
  since it is on the $scope.

  AngularJS supports AJAX through a service called the $http service. All of the core AngularJS 
  services are prefixed with $. We’ve seen this before with the $scope service.

*/

var app = angular.module('nprApp' , []);

var apiKey = 'MDE2NjgxODUzMDE0MTA0MDg1MDUxZGVhMA001',
    nprUrl = 'http://api.npr.org/query?id=61&fields=relatedLink,title,byline,text,audio,image,pullQuote,all&output=JSON';

/* Custom directive */

app.directive('nkNprLink', function() {
  return {
    restrict: 'AE',
    require: ['^ngModel'],
    replace: true,
    scope: {
      ngModel: '=', 
      play: '&'

    },
    templateUrl: 'views/nprListItem.html',
    link: function(scope, ele, attr) {
      scope.duration = scope.ngModel.audio[0].duration.$text;
    }
  }
});


/*  
  Root controller of this app.
  To add an audio element, we can either add it in the HTML or in 
  our controller. Since we’ll be interacting with the audio element primarily in our controller, 
  it makes most sense to create it here.
  We’ll store it on our scope, which means that we’ll connect the view to the controller 
  through the $scope object.

  The audio won’t play unless we tell it to play. To do that, we can simply call $scope.audio.play() (DOUBT!!!!), 
  and the HTML5 audio element will take over and start playing from the mp4 stream.
  */

app.controller('PlayerController', ['$scope', '$http', function($scope, $http) {

  $http({
    method: 'JSONP',
    url: nprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
  }).success(function(data, status) {
    /* 
      Now we have a list of the stories (data.list.story) in the data object that the NPR API returns in JSON that looks like: 
      data: { "list": {
          "title": ...
          "story": [
           { "id": ...
             "title": ... 
    */
    $scope.programs = data.list.story;
  }).error(function(data, status) {
    alert("Sorry couldnt get the listings! womp womp");
  });

  var audio = document.createElement('audio');
  $scope.audio = audio; //tying the DOM element to our scope object
  $scope.playing = false;


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

  // $scope.linkExists = function() {
  //   alert('linkExists');
  //   return false;

  // }

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







