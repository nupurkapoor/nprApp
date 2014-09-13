app.controller('PlayerController', function($scope, nprService, player) {
  $scope.player = player;
  nprService.programs(apiKey)
    .success(function(data, status) {
      $scope.programs = data.list.story;
    })
});