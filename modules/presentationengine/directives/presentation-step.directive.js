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
