mod = angular.module 'Comix', []

doSomething = () ->
        console.log( "Did it" );

scrollorama = undefined
                              
setupScroll = (scope) ->
        scrollorama = $.scrollorama blocks:'.scrollblock'
        scrollorama.onBlockChange () ->
                scope.$root.$broadcast( 'scrollblock', scrollorama.blockIndex )

cache_animation = (scope) ->
        scope.cached_animation = scope.animation
        scope.animation = undefined
        console.log "Clearing animation: #{scope.animation} / #{scope.cached_animation}"

init = ( parentId, scope, el, ctx ) ->
        cache_animation( scope )
        scope.$on 'associate', (event, ref) ->
                # console.log "Registration of #{ref} for #{ctx}"
                scope.$on "animate-#{ctx}", (event,anRef) ->
                        if ref == anRef
                                console.log "Animating for #{ref} / #{scope.animation} / #{scope.cached_animation}"
                                el.addClass( 'animated' )
                                el.addClass( scope.cached_animation )
                                scope.animation = scope.cached_animation
                                

mod.directive 'cxComix', () ->
        wantControls = false

        offset = "20px"
        controlsTemplate = """
                <div class="controls" ng-show="controls">
                <div style="position: fixed; top: #{offset}; left: #{offset}"><span class="glyphicon glyphicon-home"/></div>
                <div style="position: fixed; bottom: #{offset}; left: #{offset}"><span class="glyphicon glyphicon-envelope"/></div>
                <div style="position: fixed; bottom: #{offset}; right: #{offset}"><span ng-click="down()" class="glyphicon glyphicon-arrow-down"/></div>
                <div style="position: fixed; top: #{offset}; right: #{offset}"><span ng-click="up()" class="glyphicon glyphicon-arrow-up"/></div>
                </div>
        """

        template = () ->
                rv = ""
                rv += controlsTemplate
                rv += '<div class="text-center"><h1>{{title}}</h1></div>'
                rv += """
                <div class="container" ng-transclude></div>
                """
                rv

        return  {
                restrict: 'E',
                transclude: true
                controller: [ '$scope', (scope) ->
                        scope.up = () ->
                                console.log "Got up!"
                                scope.$root.$broadcast 'up'
                        scope.down = () ->
                                scope.$root.$broadcast 'down'
                                console.log "Got down!"
                                ]
                link: (scope,elem,attr) ->
                        wantControls = true if scope.controls
                        setupScroll( scope )
                scope: { minHeight: '@', controls: '@', title: '@' }
                template: template()
                }

index = 0

mod.directive 'cxFrame', ( $timeout ) ->
        parentIndex = 0
        return {
                restrict: 'E'
                controller: () ->
                        this.frameParent = parentIndex++
                transclude: true,
                link: (scope,el,attr,controller) ->
                        # Register the parent ID into the child 
                        scope.$root.$broadcast 'associate', controller.frameParent
                        scope.$on 'scrollblock', (event,args) ->
                                # console.log "Receiving scrollblock and re-dispatching for #{args}"
                                scope.$root.$broadcast( 'animate-characters', args )
                                scope.$root.$broadcast( 'animate-dialogs', args )
                template: """
                <div ng-transclude="true" class="col-md-3 scrollblock" style="min-height: 400px; border: 1px dotted grey; min2-height: {{ minHeight }}"></div>
                """
                }

mod.directive 'cxCharacter', () ->
        return {
                restrict: 'E',
                scope: { name: '@', animation: '@', width: '@', top: '@', left: '@' },
                require: '^cxFrame'
                link: (scope, el, attr, frame ) ->
                        init( frame.parent, scope, el, 'characters' )
                template: """
                        <img src="/assets/images//{{ name }}.png"
                        style="width: {{ width }}px; height: auto; position: absolute; top: {{top}}px; left: {{left}}px;"
                        ng-class2="{ 'animated': animation, '{{animation}}': animation }"/>
                        """
                }
                
mod.directive 'cxDialog', () ->
        return {
                restrict: 'E',
                require: '^cxFrame'
                link: ( scope, el, attr, frame ) ->
                        init( frame.parent, scope, el, 'dialogs' )
                scope: { delay: '@', animation: '@' },
                template: """
                        <div style="border: 1px solid black; width: 60%;" ng-transclude="true" ng-class2="{ 'animated': animation, '{{animation}}': animation }" ></div>
                        """
                transclude: true
                }