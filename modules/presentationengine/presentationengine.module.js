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
        'presentationengine.controllers',
        'ngResource'
      ]);

})(angular);
