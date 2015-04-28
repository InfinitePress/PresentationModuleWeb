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
