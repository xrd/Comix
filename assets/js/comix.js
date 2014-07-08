(function() {
  var mod;

  mod = angular.module('Comix', []);

  mod.controller('ComixCtrl', [
    '$scope', function($scope) {
      $scope.foobar = "barfoo";
      return console.log("Doing something now");
    }
  ]);

  mod.controller('cxCtrl', [
    '$scope', function($scope) {
      console.log("Startig cxCtrl " + $scope.name);
      return $scope.name = "";
    }
  ]);

  mod.directive('cxComix', function() {
    return {
      restrict: 'E',
      transclude: true,
      template: '<div class="container" ng-transclude></div>'
    };
  });

  mod.directive('cxFrame', function() {
    return {
      restrict: 'E',
      transclude: true,
      template: '<div ng-transclude="true" ng-controller="cxCtrl" class="col-md-4" style="border: 1px dotted grey"></div>'
    };
  });

  mod.directive('cxCharacter', function() {
    return {
      restrict: 'E',
      scope: {
        name: '@'
      },
      template: "<img src='/assets/images//{{ name }}.png'/>"
    };
  });

  mod.directive('cxDialog', function() {
    return {
      restrict: 'E',
      scope: {
        delay: '@'
      },
      template: '<div style="border: 2px solid black;" ng-transclude="true"></div>',
      transclude: true
    };
  });

}).call(this);
