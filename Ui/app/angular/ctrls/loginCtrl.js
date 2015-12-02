tok.controller('loginCtrl',['$h','$scope','$register','$modal','$http','$user','$tests', function($h,$scope,$register,$modal,$http,$user,$tests){


  var curModal = $register.gsModal();
  $scope.register = $register;


  $scope.ok = function(){
    var data = {};
    data.username = $register.gsUsername();
    data.password = $register.gsPassword();

    $h.login(data).success(function(data,config){
      if(angular.isDefined(data.response)){
        $register.gsMessage(data.response[0]);
      }else {
        $user.gsUsername(data.username);
        $user.gsToken(data.token);
        $user.setLoggedIn(true);
        $h.getTests().success(function(data,config){
          $tests.gsTests(data);
        });



        if(angular.isDefined(data.adminAccess)) $user.setAdmin(data.adminAccess);
        curModal.close();
      }
    }).error(function(data,status){
      if(status == 403) $register.gsMessage('Invalid Credentials, try again');
    });

  };

  $scope.cancel = function(){
    curModal.close();
  };


  $scope.errorsUsernmame = {};
  $scope.errorsUsernmame.len = false;
  $scope.errorsUsernmame.tak = false;

  $scope.checkUsername = function(){
    var data = {};
    data.username = $register.gsRegisterUsername();

    $scope.errorsUsernmame.len = false;
    $scope.errorsUsernmame.tak = false;

    if(data.username.length < 3 || data.username.length > 25) $scope.errorsUsernmame.len = true;
    if(!/^[A-z1-9]*$/.test(data.username)) $scope.errorsUsernmame.len = true;

    $h.usernameTaken(data).success(function(data,config){
        $scope.errorsUsernmame.tak = data.taken;
        $register.setuTaken(data.taken);
    })
  };

  $scope.passRepeatError = false;
  $scope.validatePasswordRepeat = function(){
    $scope.passRepeatError  = $register.gsRegisterPassword() != $register.gsRegisterPasswordRepeat();
  };

  $scope.errorsEmail = {};
  $scope.errorsEmail.len = false;
  $scope.errorsEmail.tak = false;

  $scope.checkEmail = function(){
    var data = {};
    data.email = $register.gsRegisterEmail();

    $scope.errorsEmail.len = false;
    $scope.errorsEmail.tak = false;
    $register.seteTaken(false);

    if(!/.*\@.*\..*/.test(data.email)) $scope.errorsEmail.len = true;
  /*
    $http({
      method: 'POST',
      url: $url.baseUrl + $url.checkEmail,
      data:data ,
      headers: {'Content-Type': 'application/json'}
    }).success(function(data,config){
      $scope.errorsEmail.tak = data.taken;
      $register.seteTaken(data.taken);
    })
    */

  };



  $scope.pageUp = function(){

    if($register.gsPage() == 1 && $register.validateAll()) $register.pageUp();
    else if($register.gsPage() != 1) $register.pageUp();

  }

  $scope.complete = function(){
    var data = {};
    data.username = $register.gsRegisterUsername();
    data.password = $register.gsRegisterPassword();
    data.email = $register.gsRegisterEmail();
    data.name = $register.gsRegisterName();
    $register.gsPage(0);
    $h.newUser(data).success(function(data,config){
      if(angular.isDefined(data.response)){
        $register.gsMessage(data.response[0]);
      }else {
        $user.gsUsername(data.username);
        $user.gsToken(data.token);
        $user.setLoggedIn(true);
        if(angular.isDefined(data.adminAccess)) $user.setAdmin(data.adminAccess);
        curModal.close();


      }
    })
  }





}]);
