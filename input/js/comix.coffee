mod = angular.module 'Comix', []

mod.controller 'ComixCtrl', [ '$scope', ($scope) ->

        $scope.foobar = "barfoo"

        console.log "Doing something now"

        ]

mod.controller 'cxCtrl', [ '$scope', ($scope) ->
        console.log "Startig cxCtrl #{$scope.name}"
        $scope.name = ""
        ]

mod.directive 'cxComix', () ->
        return  {
                restrict: 'E',
                transclude: true
                template: '<div class="container" ng-transclude></div>'
                }

mod.directive 'cxFrame', () ->
        return {
                restrict: 'E'
                transclude: true,
                template: '<div ng-transclude="true" ng-controller="cxCtrl" class="col-md-4" style="border: 1px dotted grey"></div>'
                }

mod.directive 'cxCharacter', () ->
        return {
                restrict: 'E',
                scope: { name: '@' },
                template: "<img src='/assets/images//{{ name }}.png'/>"
                }

mod.directive 'cxDialog', () ->
        return {
                restrict: 'E',
                scope: { delay: '@' },
                template: '<div style="border: 2px solid black;" ng-transclude="true"></div>',
                transclude: true
                }