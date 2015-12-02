tok.controller('searchCtrl',['$scope','$forest','$h','$user',function($scope,$forest, $h, $user){

  $scope.forest = $forest;
  $scope.user = $user;


  $scope.getForest = function(){
    $h.getForest().success(function(data,config){
      $forest.gsList(data);

    });
  };

  $scope.getForest();

  $scope.getNsfwTag = function(b){
    if(!b) return '';
    else return "Nsfw";
  };

  $scope.getSearchRoute = function(name){
    if(angular.isUndefined(name)) return '';
    return 'routes/search/_' + name.toLowerCase() + ".html";
  };

  $scope.sub = function(row){
    $h.subscribe({leafName:row.id}).success(function(data,config){
        $user.gsSubs(data);
      row.value.subCount++;
    }).error(function(data,config){

    });
  };

  $scope.unsub = function(row){
    $h.unsubscribe({leafName:row.id}).success(function(data,config){
      $user.gsSubs(data);
      row.value.subCount--;
    }).error(function(data,config){

    });
  };

}]);
