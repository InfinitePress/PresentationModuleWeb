(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  try {
    var module = angular.module('presentationengine.templates');
  } catch (e) {
    var module = angular.module('presentationengine.templates', []);
  }

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
        'presentationengine.templates',
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

angular.module("presentationengine.templates").run(["$templateCache", function($templateCache) {$templateCache.put("view-templates/presentation-element-image-view.html","<!-- Presentation Element type Image -->\n<div>\n  <img src=\"\">\n</div>\n");
$templateCache.put("view-templates/presentation-element-text-view.html","<!-- Presentation Element type Text -->\n<div id=\"bodyElementText\" ng-transclude></div>\n");
$templateCache.put("view-templates/presentation-screen-view.html","<!-- Presentation Screen Element -->\n<div id=\"bodyScreen\" ng-transclude>\n</div>\n");
$templateCache.put("view-templates/presentation-step-view.html","<!-- Presentation Step Element -->\n<div id=\"bodyStep\" ng-show=\"selected\"  ng-transclude>\n</div>\n");}]);
/**
 * Created by coichedid on 21/04/15.
 */
'use strict';
angular.module('presentationengine').directive('presentationElementImage', [
  function() {
    return {
      template: '<div></div>',
      restrict: 'E',
      replace: 'false',
      scope: {},
      link: function postLink(scope, element, attrs) {
        // Presentation shape image directive logic
        // ...

        element.text('this is the presentationElementImage directive');
      }
    };
  }
]);

/**
 * Created by coichedid on 21/04/15.
 */
'use strict';

var PresentationElementTextController = function($scope, $element) {

};

angular.module('presentationengine').directive('presentationElementText', [
  function() {
    return {
      restrict: 'E',
      // this directive needs to be presentationStep child, so we can get it's controller
      require: '^presentationStep',
      transclude: true,
      scope: {
        elementData: '='
      },
      controller: PresentationElementTextController,
      templateUrl: 'view-templates/presentation-element-text-view.html',
      compile: function(tElem, tAttrs){
        return {
          pre: function (scope, el, attrs, ctrl, transclude) {

          },
          post: function (scope, el, attrs, stepCtrl, transclude) {
            stepCtrl.addElement(scope);
          }
        };
      }
    };
  }
]);

/**
 * Created by coichedid on 21/04/15.
 */
'use strict';
var PresentationScreenController = function($scope, $element) {
  var steps = $scope.steps = [],
    currentStepIndex = 0,
    numSteps = 0;

  // process key pressed to rewind or forward presentation
  $scope.$on('keypressed',function(event,args){
    switch(args.key) {
      case 39:
      case 40: // right and down keys makes presentation goes forward
        if (currentStepIndex < numSteps - 1) {
          $scope.select(currentStepIndex + 1);
        }
        break;
      case 37:
      case 38: // left and up keys makes presentation goes rewind
        if (currentStepIndex > 0) {
          $scope.select(currentStepIndex - 1);
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
    currentStepIndex = index;
  };

  // register step on presentation screen
  this.addStep = function(step) {
    steps.push(step);
    numSteps++;
    if (steps.length === 1) {
      $scope.select(0);
    }
  };
};

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
      controller: PresentationScreenController,

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
var PresentationStepController = function($scope, $element){
  var elements = $scope.elements = [],
    numElements = 0;

  // register step on presentation screen
  this.addElement = function(element) {
    elements.push(element);
    numElements++;
  };
};

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
      controller: PresentationStepController,
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

                // Switch between elements types [text, image, line, shape]
                var elementName = '';
                switch(element.type) {
                  case 'text':
                    elementName = 'presentation-element-text';
                        break;
                  case 'image':
                    elementName = 'presentation-element-image';
                        break;
                  case 'line':
                    elementName = 'presentation-element-line';
                        break;
                  case 'shape':
                    elementName = 'presentation-element-shape';
                        break;
                }

                if (elementName === '') {
                  throw new Error('Unknown presentation element type');
                }

                var stepElement = $compile('<' + elementName + '>{{content}}' +
                  '</' + elementName + '>')(privateScope);
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
