tok.controller('accountInfoCtrl',['$scope','$user',function($scope,$user){

  $scope.out = function(){
    $user.setLoggedIn(false);
    $user.gsAccModal().close();
  };




  $scope.user = $user;

}]);
