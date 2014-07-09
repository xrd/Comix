(function() {
  var doSomething, loaded, mod;

  mod = angular.module('Comix', []);

  doSomething = function() {
    return console.log("Did it");
  };

  loaded = function() {
    var myScroll;
    myScroll = new IScroll('#wrapper');
    console.log("Got something here");
    return myScroll.on('scrollEnd', doSomething);
  };

  mod.controller('ComixCtrl', [
    '$scope', function($scope) {
      return loaded();
    }
  ]);

  mod.directive('cxComix', function() {
    return {
      restrict: 'E',
      transclude: true,
      link: function(scope, elem, attr) {
        return loaded();
      },
      scope: {
        minHeight: '@'
      },
      template: '<div class="container" ng-transclude></div>'
    };
  });

  mod.directive('cxFrame', function() {
    return {
      restrict: 'E',
      transclude: true,
      template: '<div ng-transclude="true" class="col-md-3" style="border: 1px dotted grey; min-height: {{ minHeight }}"></div>'
    };
  });

  mod.directive('cxCharacter', function() {
    return {
      restrict: 'E',
      scope: {
        name: '@',
        animation: '@',
        width: '@'
      },
      template: "<img src=\"/assets/images//{{ name }}.png\"\nstyle=\"width: {{ width }}px; height: auto;\"\nng-class=\"{ 'animated': animation, '{{animation}}': animation }\"/>"
    };
  });

  mod.directive('cxDialog', function() {
    return {
      restrict: 'E',
      scope: {
        delay: '@',
        animation: '@'
      },
      template: "<div style=\"border: 1px solid black; width: 60%;\" ng-transclude=\"true\" ng-class=\"{ 'animated': animation, '{{animation}}': animation }\" ></div>",
      transclude: true
    };
  });

}).call(this);
