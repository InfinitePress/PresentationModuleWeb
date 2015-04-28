/**
 * Created by coichedid on 27/04/15.
 */
'use strict';

(function() {
  describe('Test Presentation Step directive', function() {
    // Initialize global variables
    var $compile,
      $rootScope,
      $controller,
      scope;

    // Then we can start by loading the main application module
    beforeEach(module('presentationengine', function($compileProvider){
      var ctrl = function($scope, $element) {
        $scope.steps = [];
        this.addStep = function(step){
          $scope.steps.push(step);
        }
      };
      $compileProvider.directive('presentationScreen',function(){
        var def = {
          priority: 9999,
          terminal: true,
          restrict:'E',
          transclude: true,
          controller:ctrl,
          template:'<!-- Presentation Screen Element -->\n<div class="mock" ng-transclude></div>'
        };
        return def;
      });

      $compileProvider.directive('presentationElementText',function(){
        var def = {
          priority: 9999,
          terminal: true,
          restrict:'E',
          transclude: true,
          template:'<div class="mock text" ng-transclude></div>'
        };
        return def;
      });

      $compileProvider.directive('presentationElementImage',function(){
        var def = {
          priority: 9999,
          terminal: true,
          restrict:'E',
          transclude: true,
          template:'<div class="mock image" ng-transclude></div>'
        };
        return def;
      });

      $compileProvider.directive('presentationElementLine',function(){
        var def = {
          priority: 9999,
          terminal: true,
          restrict:'E',
          transclude: true,
          template:'<div class="mock line" ng-transclude></div>'
        };
        return def;
      });

      $compileProvider.directive('presentationElementShape',function(){
        var def = {
          priority: 9999,
          terminal: true,
          restrict:'E',
          transclude: true,
          template:'<div class="mock shape" ng-transclude></div>'
        };
        return def;
      });
    }));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function(_$compile_, _$rootScope_, _$controller_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
      $controller = _$controller_;
    }));

    it('Try to compile a presentationStep without parent presentationScreen', function() {
      var element = $compile("<presentation-step><p>teste</p></presentation-step>")($rootScope.$new(true));
      try {
        $rootScope.$digest();
      }
      catch(e) {
        expect(e.message.indexOf("Controller 'presentationScreen', required by directive 'presentationStep'") > -1).toBe(true);
      }
    });

    it('Try to compile a presentationStep', function() {
      var rootElement = $compile('<presentation-screen></presentation-screen>')(scope);
      var directiveScope = scope.$new(true);
      var element = $compile("<presentation-step></presentation-step>")(directiveScope);
      rootElement.append(element);
      scope.$digest();
      var contents = element.contents();
      // Check that the compiled element contains the templated content
      expect(contents[0].nodeType).toEqual(element[0].COMMENT_NODE);
      expect(scope.steps.length).toEqual(1);
      expect(element[1]).toBeUndefined();
    });

    it('Try to compile a presentationStep with a HTML content', function() {
      var rootElement = $compile('<presentation-screen></presentation-screen>')(scope);
      var directiveScope = scope.$new(true);
      var element = $compile("<presentation-step><p>Test</p></presentation-step>")(directiveScope);
      rootElement.append(element);
      scope.$digest();
      var contents = element.contents();
      // Check that the compiled element contains the templated content
      expect(contents[0].nodeType).toEqual(element[0].COMMENT_NODE);
      expect(contents[2].nodeType).toEqual(element[0].ELEMENT_NODE);
      expect(element.children().children().contents().text()).toContain('Test');
      expect(scope.steps.length).toEqual(1);
      expect(element[1]).toBeUndefined();
    });

    it('Try to compile a presentationScreen with wrapped directives', function() {
      var rootElement = $compile('<presentation-screen></presentation-screen>')(scope);
      var directiveScope = scope.$new(true);
      var element = $compile("<presentation-step><p>Test</p></presentation-step>")(directiveScope);
      rootElement.append(element);
      scope.$digest();
      var contents = element.contents();
      // Check that the compiled element contains the templated content
      expect(contents[0].nodeType).toEqual(element[0].COMMENT_NODE);
      expect(contents[2].nodeType).toEqual(element[0].ELEMENT_NODE);
      expect(element.children().children().contents().text()).toContain('Test');
      expect(scope.steps.length).toEqual(1);
      expect(element[1]).toBeUndefined();
    });

    it('Try to compile a presentationScreen with  presentation-data attribute', function() {
      // Compile a piece of HTML containing the directive
      scope.presentationData = {
        steps:[
          {elements:[
            {
              type:'text',
              content:'Element 1 - Content 1'
            },
            {
              type:'image',
              content:'Element 1 - Content 2'
            },
            {
              type:'line',
              content:'Element 1 - Content 3'
            },
            {
              type:'shape',
              content:'Element 1 - Content 4'
            }
          ]},
          {elements:[
            {
              type:'image',
              content:'Element 2 - Content 1'
            }
          ]}
        ]
      };

      var rootElement = $compile('<presentation-screen></presentation-screen>')(scope);
      var directiveScope = scope.$new(true);
      directiveScope.elements = scope.presentationData.steps[0].elements || [];
      var element = $compile('<presentation-step elements-data="elements"></presentation-step>')(directiveScope);
      rootElement.append(element);
      scope.$digest();
      var contents = element.contents();
      // Check that the compiled element contains the templated content
      expect(contents[0].nodeType).toEqual(element[0].COMMENT_NODE);
      expect(contents[2].nodeType).toEqual(element[0].ELEMENT_NODE);
      expect(element.children().children().length).toEqual(4);
      expect(element.children().children().slice(0,1).prop('tagName')).toEqual(angular.element('<presentation-element-text>').prop("tagName"));
      expect(element.children().children().slice(1,2).prop('tagName')).toEqual(angular.element('<presentation-element-image>').prop("tagName"));
      expect(element.children().children().slice(2,3).prop('tagName')).toEqual(angular.element('<presentation-element-line>').prop("tagName"));
      expect(element.children().children().slice(3,4).prop('tagName')).toEqual(angular.element('<presentation-element-shape>').prop("tagName"));
      expect(scope.steps.length).toEqual(1);
      expect(element[1]).toBeUndefined();
    });
  });

  describe('PresentationStep Controller', function(){
    // Initialize global variables
    var $controller,
      scope,
      ctrl;

    beforeEach(inject(function(_$controller_, _$rootScope_){
      var PresentationStepController = function($scope,$element){
        var elements = $scope.elements = [],
          numElements = 0;

        // register step on presentation screen
        this.addElement = function(element) {
          elements.push(element);
          numElements++;
        };
      };

      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
      scope = _$rootScope_;

      ctrl = $controller(PresentationStepController, {$scope:scope, $element:null});
    }));

    it('Try PresentationScreenController to add shapes', function() {
      var newScope1 = scope.$new(true),
        newScope2 = scope.$new(true);

      ctrl.addElement(newScope1);
      ctrl.addElement(newScope2);

      expect(scope.elements.length).toEqual(2);
    });
  });
}());
