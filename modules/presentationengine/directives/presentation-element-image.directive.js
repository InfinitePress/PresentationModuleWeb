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
