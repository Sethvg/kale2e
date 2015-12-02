var tok = angular.module('tok',['ui.bootstrap','ngRoute','TokHttp']);

tok.controller('main',['$scope','$user','$modal','$register','$location','$h','$tests',function($scope,$user,$modal,$register, $location, $h,$tests){
    $scope.user = $user;




    $scope.loginClick = function(){
      $register.reset();

      var curModal;
      if(!$user.isLoggedIn()) {
        curModal = $modal.open({
          animation: true,
          templateUrl: 'modals/loginModal.html',
          controller: 'loginCtrl',
          size: "lg"
        });

        $register.gsModal(curModal);

      }else{
        curModal = $modal.open({
          animation:true,
          templateUrl:'modals/accountModal.html',
          controller: 'accountInfoCtrl',
          size:'lg'
        });
        $user.gsAccModal(curModal);
      }

    };







  $scope.goto = function(url){
    $location.path(url);
    $scope.calcIndex();
  }

  $scope.calcIndex = function(){
    var p = $location.$$path;
    if(p == '/root') index = 0;
    else if(p == '/search') index = 1;
    else if(p == '/arrange') index = 2;
    else if(p == '/admin') index = 'admin';
  }


  $scope.getMenuButtonStyle = function(index,length){
    var style = {};

    if(index == 0){
      style["margin-right"] = "5px";
      style["margin-left"] = "10px";
    }else if(index == length-1){
      style["margin-right"] = "10px";
      style["margin-left"] = "5px";
    }else{
      style.margin = "0px 5px";
    }

    style.width = window.innerWidth/length;
    return style;
  };

  $scope.buttons = [
    {name:'Home', glyph:"glyphicon glyphicon-leaf", click:function(ind){
      $scope.goto('/root');

    }},
    {name: 'Search', glyph:"glyphicon glyphicon-search", click:function(ind){
      $scope.goto('/search');
    }},

    {name:'Account', glyph:"glyphicon glyphicon-user", click:function(ind){
      $scope.loginClick();
    }},
    {name:'Inbox', glyph:"glyphicon glyphicon-inbox", click:function(ind){
      console.log('hello3');
    }}];

  var index = 0;

  $scope.calcIndex();


  $scope.setIndex = function(ind){
    index = ind;
  };

  $scope.getIndex = function(){
    return index;
  };

  var showMenu = false;

  $scope.getMenuStyle = function(){
    var style = {};
    style.height = "80%";
    if(showMenu)
    {
      style.width = "20%";
    }else{
      style.width = "20px";
    }

    return style;
  };

  $scope.hideMenu = function(){ showMenu = false; };
  $scope.showMenu = function(){ showMenu = true; };
  $scope.menuVisible = function(){ return showMenu; };


    $user.setLoggedIn(true);
    $user.gsToken("1129b63c9458822569ea405ccd45bd12a16d2eec46b88e4363d1dbe94e37744281cda0df1017796c806bcd896fd97b06bba1235a7d86b903e49e2200d0821739");
    $user.gsUsername('kalieki');
    $user.setAdmin(true);



  $scope.slides = [];

  for(var a = 1; a < 6; a++){
    $scope.slides.push({img:"images/login" + a + ".jpg", active:false});
  }


  $scope.tests = $tests;

  if($user.isLoggedIn()){
    $h.verifyUser({username:$user.gsUsername(),token:$user.gsToken()}).success(function(data,config){
           if(data != "Valid"){
             $user.setLoggedIn(false);
           }else{
             $h.getTests().success(function(data,config){
               $tests.gsTests(data);
             })
           }
    });
  }

  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];




}]);
