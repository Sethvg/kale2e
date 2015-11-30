tok.service('$register',function(){


  var maxPages = 3;
  var specialChars = /[\!\@\#\$\%\^\&\*\(\)\,\.]+/;






  var Modal;

  this.gsModal = function(val)
  {
      if(angular.isDefined(val)) Modal = val;
      else return Modal;
  };

  var Page = 0;

  this.gsPage = function(val)
  {
      if(angular.isDefined(val)) Page = val;
      else return Page;
  };

  this.pageUp = function(){
    Page++;
  };

  this.pageDown = function(){
    Page--;

    if(Page == 0) this.reset();
  };


  this.getMaxPage = function(){
    return maxPages;
  };

  var Password;

  this.gsPassword = function(val)
  {
      if(angular.isDefined(val)) Password = val;
      else return Password;
  };



  var Username;

  this.gsUsername = function(val)
  {
      if(angular.isDefined(val)) Username = val;
      else return Username;
  };

  var Message;

  this.gsMessage = function(val)
  {
      if(angular.isDefined(val)) Message = val;
      else return Message;
  };


  this.reset = function(){
    Message = '';
    Username = '';
    Password = '';
    Page = 0;

    RegisterPasswordRepeat = '';
    RegisterEmail = '';
    RegisterName = '';
    RegisterPassword = '';
    RegisterUsername = '';
  }






  var RegisterName;

  this.gsRegisterName = function(val)
  {
      if(angular.isDefined(val)) RegisterName = val;
      else return RegisterName;
  }

  var RegisterUsername;

  this.gsRegisterUsername = function(val)
  {
      if(angular.isDefined(val)) RegisterUsername = val;
      else return RegisterUsername;
  }

  var RegisterPassword;

  this.gsRegisterPassword = function(val)
  {
      if(angular.isDefined(val)) RegisterPassword = val;
      else return RegisterPassword;
  }

  var RegisterPasswordRepeat;

  this.gsRegisterPasswordRepeat = function(val)
  {
      if(angular.isDefined(val)) RegisterPasswordRepeat = val;
      else return RegisterPasswordRepeat;
  };



  var RegisterEmail;

  this.gsRegisterEmail = function(val)
  {
      if(angular.isDefined(val)) RegisterEmail = val;
      else return RegisterEmail;
  }



  this.calcStrengthType = function(){
    str = this.calcStrengthValue();
    if(str  == 100) return 'success';
    else if(str > 60) return 'warning';
    else return 'danger'
  };

  this.calcStrengthValue = function(){
    var s = 0;
    var ret = this.validatePassword();


    ret.len ? s+= 50 : s+= (RegisterPassword.length * 50 / 8);
    if (ret.cap) s+=10;
    if(ret.special) s+=30;
    if(ret.num)s+=10;


    return s;
  };

  this.validatePassword = function(){
    var ret = {};
    ret.len = RegisterPassword.length >= 8;
    ret.cap = /[A-Z]/.test(RegisterPassword);
    ret.special = specialChars.test(RegisterPassword);
    ret.num = /[1-9]/.test(RegisterPassword);
    return ret;
  }



    this.validateAll = function(){
      var o = this.validatePassword();
      if(!o.len || !o.cap  || !o.special || !o.num) return false;
      if(RegisterPassword != RegisterPasswordRepeat) return false;
      if(uTaken || eTaken) return false;
      if(RegisterPassword == '' || RegisterEmail == '' || RegisterUsername == '') return;
      return true;
    }

  var uTaken = false;


  this.setuTaken = function(val){
      uTaken = val;
  };

  var eTaken = false;


  this.seteTaken = function(val){
      eTaken = val;
  };
























});
