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

    $scope.presentationData = {
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
});
