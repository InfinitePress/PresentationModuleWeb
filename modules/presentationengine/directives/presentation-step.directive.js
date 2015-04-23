/**
 * Created by coichedid on 21/04/15.
 */
'use strict';
angular.module('presentationengine').directive('presentationStep', [
  function() {
    return {
      restrict: 'E',
      replace: 'false',
      scope: {},
      templateUrl: '../view-templates/presentation-step-view.html',
      link: function postLink(scope, element, attrs) {

      }
    };
  }
]);
