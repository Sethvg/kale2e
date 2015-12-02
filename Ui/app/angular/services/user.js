tok.service('$user',['$rootScope',function($rootScope){

  var LoggedIn = false;

  this.isLoggedIn = function(){
      return LoggedIn
  };

  this.setLoggedIn = function(val){
    if(val == true){
      $rootScope.$broadcast('loggedIn');
    }
      LoggedIn = val;
      Admin = false;
  };

  var Username;

  this.gsUsername = function(val)
  {
      if(angular.isDefined(val)) Username = val;
      else return Username;
  }

  var Token;

  this.gsToken = function(val)
  {
      if(angular.isDefined(val)) Token = val;
      else return Token;
  }


  var AccModal;

  this.gsAccModal = function(val)
  {
      if(angular.isDefined(val)) AccModal = val;
      else return AccModal;
  };




  var Admin = false;

  this.isAdmin = function(){
      return Admin
  };

  this.setAdmin = function(val){
      Admin = val;
  };











}]);
