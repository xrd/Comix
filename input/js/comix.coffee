mod = angular.module 'Comix', []

doSomething = () ->
        console.log( "Did it" );

scrollorama = undefined
                              
setupScroll = ( scope ) -> 
        $( '.scrollblock' ).on 'inview', (event,elem) ->
                parent = event.target.classList[event.target.classList.length-1]
                parentId = parent.substr("frame".length)
                scope.$root.$broadcast( 'scrollblock', parentId )

cache_animation = (scope) ->
        scope.cached_animation = scope.animation
        scope.animation = undefined

init = ( frame, scope, el, ctx ) ->
        cache_animation( scope )
        scope.$on 'associate', (event, ref) ->
                if frame.parentId == ref
                        console.log "Setting parentId: #{frame.parentId} / #{ref} / #{ctx}"
                        scope.frameParent = frame.parentId
                        scope.$on "animate-#{ctx}", ( event, anRef ) ->
                                if ref == anRef
                                        scope.animation = scope.cached_animation

mod.directive 'cxComix', ($timeout) ->
        wantControls = false
        offset = "20"
        controlsTemplate = """
                <div style="position: fixed; bottom: #{offset}px; width: 100%; z-index: 1000;">
                        <div class="controls" ng-show="controls" class="text-center" style="width: 100%">
                                <span ng-click="goUp()" class="glyphicon glyphicon-arrow-up"></span>
                                <span ng-click="goDown()" class="glyphicon glyphicon-arrow-down"></span>
                                <span class="glyphicon glyphicon-home"></span>
                                <span class="glyphicon glyphicon-share"></span>
                        </div>
                </div>
        """

        template = () ->
                rv = ""
                rv += controlsTemplate
                rv += '<div class="text-center"><h1>{{title}}</h1></div>'
                rv += """
                <div class="container" ng-transclude="true"></div>
                """
                rv

        return  {
                restrict: 'E',
                transclude: true
                controller: [ '$scope', (scope) ->
                        scope.goUp = () ->
                                console.log "Got up!"
                                scope.$root.$broadcast 'up'
                        scope.goDown = () ->
                                console.log "Got down!"
                                scope.$root.$broadcast 'down'
                                ]
                link: (scope,elem,attr) ->
                        wantControls = true if scope.controls
                        setupScroll( scope )
                scope: { controls: '@', title: '@' }
                template: template()
                }

mod.directive 'cxFrame', () ->
                
        parentIndex = 0
        getTemplate = () ->
                """
                ID: {{frameParent}}
                <div class="col-md-3" style="border: 1px dotted grey; height: 400px;">
                <div ng-transclude="true" class="scrollblock frame{{frameParent}}"></div>
                </div>
                """

        return {
                restrict: 'E'
                transclude: true,
                controller: () ->
                        this.parentId = parentIndex
                        parentIndex++
                link: ( scope, el, attr, controller ) ->
                        console.log "Controller: #{controller.parentId}"
                        scope.$broadcast 'associate', controller.parentId
                        scope.$on 'scrollblock', ( event, parentId ) ->
                                console.log "Got scrollblock rebroadcast #{event.target}/ #{parentId}"
                                if parentIndex == parentId
                                        console.log "Receiving scrollblock and re-dispatching for #{parentId}"
                                        scope.$root.$broadcast( 'animate-characters', parentId )
                                        scope.$root.$broadcast( 'animate-dialogs', parentId )
                template: getTemplate()
                }

mod.directive 'cxCharacter', () ->
        return {
                restrict: 'E',
                require: '^cxFrame'
                scope: { name: '@', 'animation': '@', width: '@', top: '@', left: '@' },
                link: (scope, el, attr, frame ) ->
                        init( frame, scope, el, 'characters' )
                template: """
                        <img src="/assets/images//{{ name }}.png"
                        style="width: {{ width }}px; height: auto; position: absolute; top: {{top}}px; left: {{left}}px;"
                        ng-class="{ 'animated': animation, '{{animation}}': animation }"/>
                        """
                }
                
mod.directive 'cxDialog', () ->
        return {
                restrict: 'E',
                require: '^cxFrame'
                link: ( scope, el, attr, frame ) ->
                        init( frame, scope, el, 'dialogs' )
                scope: { delay: '@', animation: '@' },
                template: """
                        <p ng-transclude="true" class="bubble speech" ng-class="{ 'animated': animation, '{{animation}}': animation }" ></p>
                        """
                transclude: true
                }