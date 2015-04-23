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

})(angular);

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
      templateUrl: '../view-templates/presentation-screen-view.html',
      link: function postLink(scope, element, attrs) {

      }
    };
  }
]);

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
