tok.controller('accountInfoCtrl',['$scope','$user','$tests',function($scope,$user,$tests){

  $scope.out = function(){
    $tests.reset();
    $user.setLoggedIn(false);
    $user.gsAccModal().close();
  };




  $scope.user = $user;

}]);
