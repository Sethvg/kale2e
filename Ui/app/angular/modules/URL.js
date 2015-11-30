TokHttp.service('$url',function(){

  this.baseUrl = "http://localhost:3000";

  //****************************************//
  //                 USER                   //
  //****************************************//

  this.login = '/user/login';
  this.register = '/user/new';
  this.checkEmail = '/user/taken/email';
  this.checkUsername = '/user/taken/username';
  this.verifyToken = '/user/verify';


  //*****************************************//
  //                  TESTS
  //*****************************************//



  this.getTests = '/tests/get';





});
