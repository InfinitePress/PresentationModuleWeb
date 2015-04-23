/**
 * Created by coichedid on 21/04/15.
 */
'use strict';
angular.module('presentationengine').directive('presentationScreen', [
  function() {
    return {
      restrict: 'E',
      replace: 'false',
      scope: {},
      templateUrl: 'view-templates/presentation-screen-view.html',
      link: function postLink(scope, element, attrs) {

      }
    };
  }
]);
