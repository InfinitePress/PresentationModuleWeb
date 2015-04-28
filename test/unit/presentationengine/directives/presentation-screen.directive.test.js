/**
 * Created by coichedid on 27/04/15.
 */
'use strict';

(function() {
  describe('Test Presentation Screen directive', function() {
    // Initialize global variables
    var $compile,
      $rootScope;

    // Then we can start by loading the main application module
    beforeEach(module('presentationengine', function($compileProvider){
      $compileProvider.directive('presentationStep',function(){
        var def = {
          priority: 9999,
          terminal: true,
          restrict:'E',
          template:'<div class="mock">this is a mock</div>'
        };
        return def;
      });
    }));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function(_$compile_, _$rootScope_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('Try to compile a presentationScreen', function() {
      // Compile a piece of HTML containing the directive
      var element = $compile("<presentation-screen></presentation-screen>")($rootScope);
      // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
      $rootScope.$digest();
      var contents = element.contents();
      // Check that the compiled element contains the templated content
      expect(contents[0].nodeType).toEqual(element[0].COMMENT_NODE);
      expect(element[1]).toBeUndefined();
    });

    it('Try to compile a presentationScreen with a HTML content', function() {
      // Compile a piece of HTML containing the directive
      var element = $compile("<presentation-screen><p>Test</p></presentation-screen>")($rootScope);
      // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
      $rootScope.$digest();
      var contents = element.contents();
      // Check that the compiled element contains the templated content
      expect(contents[0].nodeType).toEqual(element[0].COMMENT_NODE);
      expect(contents[2].nodeType).toEqual(element[0].ELEMENT_NODE);
      expect(element.children().children().contents().text()).toContain('Test');
      expect(element[1]).toBeUndefined();
    });

    it('Try to compile a presentationScreen with wrapped directives', function() {
      // Compile a piece of HTML containing the directive
      var element = $compile("<presentation-screen><presentation-step><p>Test</p></presentation-step></presentation-screen>")($rootScope);
      // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
      $rootScope.$digest();
      var contents = element.contents();
      // Check that the compiled element contains the templated content
      expect(contents[0].nodeType).toEqual(element[0].COMMENT_NODE);
      expect(contents[2].nodeType).toEqual(element[0].ELEMENT_NODE);
      expect(element.children().children().prop('tagName')).toEqual(angular.element('<presentation-step>').prop("tagName"));
      expect(element.children().children().children().contents().text()).toEqual('this is a mock');
      expect(element[1]).toBeUndefined();
    });

    it('Try to compile a presentationScreen with  presentation-data attribute', function() {
      // Compile a piece of HTML containing the directive
      $rootScope.presentationData = {
        steps:[
          {elements:[
            {content:'Element 1 - Content 1'},
            {content:'Element 1 - Content 2'}
          ]},
          {elements:[
            {content:'Element 2 - Content 1'}
          ]}
        ]
      };
      var element = $compile('<presentation-screen  presentation-data="presentationData"></presentation-screen>')($rootScope);
      // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
      $rootScope.$digest();
      var contents = element.contents();
      // Check that the compiled element contains the templated content
      expect(contents[0].nodeType).toEqual(element[0].COMMENT_NODE);
      expect(contents[2].nodeType).toEqual(element[0].ELEMENT_NODE);
      expect(element.children().children().prop('tagName')).toEqual(angular.element('<presentation-step>').prop("tagName"));
      expect(element.children().children().filter(':first-child').contents().text()).toEqual('this is a mock');
      expect(element[1]).toBeUndefined();
    });
  });

  describe('PresentationScreen Controller', function(){
    // Initialize global variables
    var $controller,
      scope,
      ctrl;

    beforeEach(inject(function(_$controller_, _$rootScope_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
      scope = _$rootScope_;

      ctrl = $controller(PresentationScreenController, {$scope:scope, $element:null});
    }));

    it('Try PresentationScreenController to add shapes', function() {
      var newScope1 = scope.$new(true),
        newScope2 = scope.$new(true);

      ctrl.addStep(newScope1);
      ctrl.addStep(newScope2);

      expect(scope.steps.length).toEqual(2);
      expect(scope.steps[0].selected).toBe(true);
      expect(scope.steps[1].selected).toBe(undefined);
    });

    it('Try PresentationScreenController to select shapes', function() {
      var newScope1 = scope.$new(true),
        newScope2 = scope.$new(true);

      ctrl.addStep(newScope1);
      ctrl.addStep(newScope2);

      expect(scope.steps.length).toEqual(2);
      expect(scope.steps[0].selected).toBe(true);
      expect(scope.steps[1].selected).toBe(undefined);

      scope.select(1);
      expect(scope.steps[0].selected).toBe(false);
      expect(scope.steps[1].selected).toBe(true);

      scope.select(0);
      expect(scope.steps[0].selected).toBe(true);
      expect(scope.steps[1].selected).toBe(false);
    });

    it('Try PresentationScreenController handle rigth key press', function() {
      var newScope1 = scope.$new(true),
        newScope2 = scope.$new(true);

      ctrl.addStep(newScope1);
      ctrl.addStep(newScope2);

      expect(scope.steps.length).toEqual(2);
      expect(scope.steps[0].selected).toBe(true);
      expect(scope.steps[1].selected).toBe(undefined);

      scope.$apply(function(){
        scope.$broadcast('keypressed', {key:39});
      });
      expect(scope.steps[0].selected).toBe(false);
      expect(scope.steps[1].selected).toBe(true);

      // try again, need to stop on last Step
      scope.$apply(function(){
        scope.$broadcast('keypressed', {key:39});
      });
      expect(scope.steps[0].selected).toBe(false);
      expect(scope.steps[1].selected).toBe(true);
    });

    it('Try PresentationScreenController handle down key press', function() {
      var newScope1 = scope.$new(true),
        newScope2 = scope.$new(true);

      ctrl.addStep(newScope1);
      ctrl.addStep(newScope2);

      expect(scope.steps.length).toEqual(2);
      expect(scope.steps[0].selected).toBe(true);
      expect(scope.steps[1].selected).toBe(undefined);

      scope.$apply(function(){
        scope.$broadcast('keypressed', {key:40});
      });
      expect(scope.steps[0].selected).toBe(false);
      expect(scope.steps[1].selected).toBe(true);

      // try again, need to stop on last Step
      scope.$apply(function(){
        scope.$broadcast('keypressed', {key:40});
      });
      expect(scope.steps[0].selected).toBe(false);
      expect(scope.steps[1].selected).toBe(true);
    });

    it('Try PresentationScreenController handle left key press', function() {
      var newScope1 = scope.$new(true),
        newScope2 = scope.$new(true);

      ctrl.addStep(newScope1);
      ctrl.addStep(newScope2);

      expect(scope.steps.length).toEqual(2);
      expect(scope.steps[0].selected).toBe(true);
      expect(scope.steps[1].selected).toBe(undefined);

      scope.select(1);
      expect(scope.steps[0].selected).toBe(false);
      expect(scope.steps[1].selected).toBe(true);

      scope.$apply(function(){
        scope.$broadcast('keypressed', {key:37});
      });
      expect(scope.steps[0].selected).toBe(true);
      expect(scope.steps[1].selected).toBe(false);

      // try again, need to stop on last Step
      scope.$apply(function(){
        scope.$broadcast('keypressed', {key:37});
      });
      expect(scope.steps[0].selected).toBe(true);
      expect(scope.steps[1].selected).toBe(false);
    });

    it('Try PresentationScreenController handle up key press', function() {
      var newScope1 = scope.$new(true),
        newScope2 = scope.$new(true);

      ctrl.addStep(newScope1);
      ctrl.addStep(newScope2);

      expect(scope.steps.length).toEqual(2);
      expect(scope.steps[0].selected).toBe(true);
      expect(scope.steps[1].selected).toBe(undefined);

      scope.select(1);
      expect(scope.steps[0].selected).toBe(false);
      expect(scope.steps[1].selected).toBe(true);

      scope.$apply(function(){
        scope.$broadcast('keypressed', {key:38});
      });
      expect(scope.steps[0].selected).toBe(true);
      expect(scope.steps[1].selected).toBe(false);

      // try again, need to stop on last Step
      scope.$apply(function(){
        scope.$broadcast('keypressed', {key:38});
      });
      expect(scope.steps[0].selected).toBe(true);
      expect(scope.steps[1].selected).toBe(false);
    });
  });
}());
