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