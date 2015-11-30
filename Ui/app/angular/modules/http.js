
var TokHttp = angular.module('TokHttp',[]);
TokHttp.service('$h',function($http, $url){

  this.login = function(data){
    return $http({
      method: 'POST',
      url: $url.baseUrl + $url.login,
      data:data ,
      headers: {'Content-Type': 'application/json'}
    });
  }

  this.usernameTaken = function(data){
    return $http({
      method: 'POST',
      url: $url.baseUrl + $url.checkUsername,
      data:data ,
      headers: {'Content-Type': 'application/json'}
    });
  }

  this.newUser = function(data){
    return $http({
      method: 'POST',
      url: $url.baseUrl + $url.register,
      data:data ,
      headers: {'Content-Type': 'application/json'}
    })
  };



  this.verifyUser = function(data){
    return $http({
      method: 'POST',
      url: $url.baseUrl + $url.verifyToken,
      data:data ,
      headers: {'Content-Type': 'application/json'}
    })
  }




  this.getTests = function(){
    return $http({
      method: 'POST',
      url: $url.baseUrl + $url.getTests,
      data:{filters:[]} ,
      headers: {'Content-Type': 'application/json'}
    })
  }





});
