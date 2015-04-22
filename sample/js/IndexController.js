/**
 * Created by coichedid on 22/04/15.
 */
app.controller('presentationController', function($scope){
    $scope.welcome = 'InfinitePress Presentation Sample';
    try {
        angular.module("presentationengine");
        $scope.presentationengineExists = true;
    } catch(err) {
        $scope.presentationengineExists = false;
    /* failed to require */
    }
});