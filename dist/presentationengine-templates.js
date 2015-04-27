angular.module("presentationengine").run(["$templateCache", function($templateCache) {$templateCache.put("view-templates/presentation-screen-view.html","<div id=\"bodyScreen\" ng-transclude>\n</div>\n");
$templateCache.put("view-templates/presentation-shape-image-view.html","\n");
$templateCache.put("view-templates/presentation-shape-text-view.html","\n");
$templateCache.put("view-templates/presentation-step-view.html","<div id=\"bodyStep\" ng-show=\"selected\"  ng-transclude>\n</div>\n");}]);