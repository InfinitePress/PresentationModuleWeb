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
