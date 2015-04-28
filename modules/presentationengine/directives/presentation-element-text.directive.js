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
