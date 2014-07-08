mod = angular.module 'Comix', []

doSomething = () ->
        console.log( "Did it" );
              
loaded = () ->
        myScroll = new IScroll('#wrapper');
        myScroll.on('scrollEnd', doSomething);

mod.controller 'ComixCtrl', [ '$scope', ($scope) ->

        loaded()
                
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
                template: '<div ng-transclude="true" class="col-md-3" style="border: 1px dotted grey"></div>'
                }

mod.directive 'cxCharacter', () ->
        return {
                restrict: 'E',
                scope: { name: '@', animation: '@' },
                template: """
                        <img src="/assets/images//{{ name }}.png" ng-class="{ 'animated': animation, '{{animation}}': animation }"/>
                        """
                }
                
mod.directive 'cxDialog', () ->
        return {
                restrict: 'E',
                scope: { delay: '@', animation: '@' },
                template: """
                        <div style="border: 1px solid black; width: 60%;" ng-transclude="true" ng-class="{ 'animated': animation, '{{animation}}': animation }" ></div>
                        """
                transclude: true
                }