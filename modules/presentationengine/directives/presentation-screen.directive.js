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
