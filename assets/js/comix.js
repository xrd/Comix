(function() {
  var cache_animation, doSomething, index, init, mod, scrollorama, setupScroll;

  mod = angular.module('Comix', []);

  doSomething = function() {
    return console.log("Did it");
  };

  scrollorama = void 0;

  setupScroll = function(scope) {
    scrollorama = $.scrollorama({
      blocks: '.scrollblock'
    });
    return scrollorama.onBlockChange(function() {
      return scope.$root.$broadcast('scrollblock', scrollorama.blockIndex);
    });
  };

  cache_animation = function(scope) {
    scope.cached_animation = scope.animation;
    scope.animation = void 0;
    return console.log("Clearing animation: " + scope.animation + " / " + scope.cached_animation);
  };

  init = function(parentId, scope, el, ctx) {
    cache_animation(scope);
    return scope.$on('associate', function(event, ref) {
      return scope.$on("animate-" + ctx, function(event, anRef) {
        if (ref === anRef) {
          console.log("Animating for " + ref + " / " + scope.animation + " / " + scope.cached_animation);
          el.addClass('animated');
          el.addClass(scope.cached_animation);
          return scope.animation = scope.cached_animation;
        }
      });
    });
  };

  mod.directive('cxComix', function() {
    var controlsTemplate, offset, template, wantControls;
    wantControls = false;
    offset = "20px";
    controlsTemplate = "<div class=\"controls\" ng-show=\"controls\">\n<div style=\"position: fixed; top: " + offset + "; left: " + offset + "\"><span class=\"glyphicon glyphicon-home\"/></div>\n<div style=\"position: fixed; bottom: " + offset + "; left: " + offset + "\"><span class=\"glyphicon glyphicon-envelope\"/></div>\n<div style=\"position: fixed; bottom: " + offset + "; right: " + offset + "\"><span ng-click=\"down()\" class=\"glyphicon glyphicon-arrow-down\"/></div>\n<div style=\"position: fixed; top: " + offset + "; right: " + offset + "\"><span ng-click=\"up()\" class=\"glyphicon glyphicon-arrow-up\"/></div>\n</div>";
    template = function() {
      var rv;
      rv = "";
      rv += controlsTemplate;
      rv += '<div class="text-center"><h1>{{title}}</h1></div>';
      rv += "<div class=\"container\" ng-transclude></div>";
      return rv;
    };
    return {
      restrict: 'E',
      transclude: true,
      controller: [
        '$scope', function(scope) {
          scope.up = function() {
            console.log("Got up!");
            return scope.$root.$broadcast('up');
          };
          return scope.down = function() {
            scope.$root.$broadcast('down');
            return console.log("Got down!");
          };
        }
      ],
      link: function(scope, elem, attr) {
        if (scope.controls) {
          wantControls = true;
        }
        return setupScroll(scope);
      },
      scope: {
        minHeight: '@',
        controls: '@',
        title: '@'
      },
      template: template()
    };
  });

  index = 0;

  mod.directive('cxFrame', function($timeout) {
    var parentIndex;
    parentIndex = 0;
    return {
      restrict: 'E',
      controller: function() {
        return this.frameParent = parentIndex++;
      },
      transclude: true,
      link: function(scope, el, attr, controller) {
        scope.$root.$broadcast('associate', controller.frameParent);
        return scope.$on('scrollblock', function(event, args) {
          scope.$root.$broadcast('animate-characters', args);
          return scope.$root.$broadcast('animate-dialogs', args);
        });
      },
      template: "<div ng-transclude=\"true\" class=\"col-md-3 scrollblock\" style=\"min-height: 400px; border: 1px dotted grey; min2-height: {{ minHeight }}\"></div>"
    };
  });

  mod.directive('cxCharacter', function() {
    return {
      restrict: 'E',
      scope: {
        name: '@',
        animation: '@',
        width: '@',
        top: '@',
        left: '@'
      },
      require: '^cxFrame',
      link: function(scope, el, attr, frame) {
        return init(frame.parent, scope, el, 'characters');
      },
      template: "<img src=\"/assets/images//{{ name }}.png\"\nstyle=\"width: {{ width }}px; height: auto; position: absolute; top: {{top}}px; left: {{left}}px;\"\nng-class2=\"{ 'animated': animation, '{{animation}}': animation }\"/>"
    };
  });

  mod.directive('cxDialog', function() {
    return {
      restrict: 'E',
      require: '^cxFrame',
      link: function(scope, el, attr, frame) {
        return init(frame.parent, scope, el, 'dialogs');
      },
      scope: {
        delay: '@',
        animation: '@'
      },
      template: "<div style=\"border: 1px solid black; width: 60%;\" ng-transclude=\"true\" ng-class2=\"{ 'animated': animation, '{{animation}}': animation }\" ></div>",
      transclude: true
    };
  });

}).call(this);
