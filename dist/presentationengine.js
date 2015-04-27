(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('presentationengine.config', [])
      .value('presentationengine.config', {
          debug: true
      });

  // Modules

  angular.module('presentationengine.directives', []);


  angular.module('presentationengine.filters', []);


  angular.module('presentationengine.services', []);


    angular.module('presentationengine.controllers', []);

  angular.module('presentationengine',
      [
        'presentationengine.config',
        'presentationengine.directives',
        'presentationengine.filters',
        'presentationengine.services',
        'presentationengine.controllers'
      ]);

  angular.module('presentationengine').run([
    '$rootScope',
    function($rootScope){
      document.onkeydown = function(e) {
        // Get keycode and broadcast it
        var keyCode = e.keyCode;

        $rootScope.$apply(function(){
          $rootScope.$broadcast('keypressed', {key:keyCode});
        });
      };
    }
  ]);

})(angular);

angular.module("presentationengine").run(["$templateCache", function($templateCache) {$templateCache.put("view-templates/presentation-screen-view.html","<div id=\"bodyScreen\" ng-transclude>\n</div>\n");
$templateCache.put("view-templates/presentation-shape-image-view.html","\n");
$templateCache.put("view-templates/presentation-shape-text-view.html","\n");
$templateCache.put("view-templates/presentation-step-view.html","<div id=\"bodyStep\" ng-show=\"selected\"  ng-transclude>\n</div>\n");}]);
/**
 * Created by coichedid on 21/04/15.
 */
'use strict';
angular.module('presentationengine').directive('presentationScreen',
  function($compile) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        title: '@',
        presentationData: '='
      },
      templateUrl: 'view-templates/presentation-screen-view.html',
      controller: function($scope) {
        var steps = $scope.steps = [],
          currentStepIndex = 0,
          numSteps = 0;

        // process key pressed to rewind or forward presentation
        $scope.$on('keypressed',function(event,args){
          switch(args.key) {
            case 39:
            case 40: // right and down keys makes presentation goes forward
              if (currentStepIndex < numSteps - 1) {
                currentStepIndex++;
                $scope.select(currentStepIndex);
              }
              break;
            case 37:
            case 38: // left and up keys makes presentation goes rewind
              if (currentStepIndex > 0) {
                currentStepIndex--;
                $scope.select(currentStepIndex);
              }
              break;
          }
        });

        // select a step based on current index
        // set current step's scope.select to true and all others to false
        $scope.select = function(index) {
          angular.forEach(steps, function(step) {
            step.selected = false;
          });
          var step = steps[index];
          step.selected = true;
        };

        // register step on presentation screen
        this.addStep = function(step) {
          steps.push(step);
          numSteps++;
          if (steps.length === 1) {
            $scope.select(0);
          }
        };
      },

      compile: function(tElem, tAttrs){
        if (tAttrs.presentationData) {
          // presentation data comes from parent scope, so we need to clear its own content
          var body = tElem.find('#bodyScreen');
          body.removeAttr('ng-transclude');
        }
        return {
          pre: function(scope, el, attrs, ctrl, transclude){
            if (scope.presentationData) {
              // presentation data comes from parent scope
              // recover steps from scope
              var body = el.find('#bodyScreen'),
                model = scope.presentationData || {},
                steps = model.steps || [];
              steps.forEach(function(step){
                // create a an isolated scope for each step
                var privateScope = scope.$new(true);
                privateScope.elements = step.elements || [];
                // create and compile a single step
                var stepElement = $compile('<presentation-step elements-data="elements">' +
                  '</presentation-step>')(privateScope);
                // add newly created step to presentation screen
                body.append(stepElement);
              });
            }
          },
          //post: function(scope, el, attrs, ctrl, transclude){
          //  console.log('screen post link id: ' + scope.$id);
          //}
        };
      }
    };
  }
);

/**
 * Created by coichedid on 21/04/15.
 */
'use strict';
angular.module('presentationengine').directive('presentationShapeImage', [
  function() {
    return {
      template: '<div></div>',
      restrict: 'E',
      replace: 'false',
      scope: {},
      link: function postLink(scope, element, attrs) {
        // Presentation shape image directive logic
        // ...

        element.text('this is the presentationShapeImage directive');
      }
    };
  }
]);

/**
 * Created by coichedid on 21/04/15.
 */
'use strict';
angular.module('presentationengine').directive('presentationShapeText', [
  function() {
    return {
      template: '<div></div>',
      restrict: 'E',
      replace: 'false',
      scope: {},
      link: function postLink(scope, element, attrs) {
        // Presentation shape text directive logic
        // ...

        element.text('this is the presentationShapeText directive');
      }
    };
  }
]);

/**
 * Created by coichedid on 21/04/15.
 */
'use strict';
angular.module('presentationengine').directive('presentationStep',
  function($compile) {
    return {
      restrict: 'E',
      transclude: true,
      // this directive needs to be presentationScreen child, so we can get it's controller
      require: '^presentationScreen',
      scope: {
        title: '@',
        elementsData: '='
      },
      templateUrl: 'view-templates/presentation-step-view.html',
      compile: function(tElem, tAttrs){
        if (tAttrs.elementsData) {
          // presentation data is coming from scope binding, so dismiss step content
          var body = tElem.find('#bodyStep');
          body.removeAttr('ng-transclude');
        }
        return {
          pre: function(scope, el, attrs, ctrl, transclude){
            if (scope.elementsData) {
              // presentation data is coming from scope binding
              // get elements for this step from scope
              var body = el.find('#bodyStep'),
                elements = scope.elementsData || [];
              elements.forEach(function(element){
                // create a isolated scope for this step
                var privateScope = scope.$new(true);
                privateScope.content = element.content || '';
                var stepElement = $compile('<p>{{content}}' +
                  '</p>')(privateScope);
                // append newly created element
                body.append(stepElement);
              });
            }
          },
          post: function(scope, el, attrs, screenCtrl, transclude){
            // register this step on presentation screen
            screenCtrl.addStep(scope);
          }
        };
      }
    };
  }
);
