'use strict';

describe('', function() {

  var module;
  var dependencies;
  dependencies = [];

  var hasModule = function(module) {
  return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function() {

  // Get module
  module = angular.module('presentationengine');
  dependencies = module.requires;
  });

  it('should load config module', function() {
    expect(hasModule('presentationengine.config')).to.be.ok;
  });

  
  it('should load filters module', function() {
    expect(hasModule('presentationengine.filters')).to.be.ok;
  });
  

  
  it('should load directives module', function() {
    expect(hasModule('presentationengine.directives')).to.be.ok;
  });
  

  
  it('should load services module', function() {
    expect(hasModule('presentationengine.services')).to.be.ok;
  });
  

  
    it('should load controllers module', function() {
      expect(hasModule('presentationengine.controllers')).to.be.ok;
    });
  

});
