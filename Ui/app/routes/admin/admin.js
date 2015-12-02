
tok.controller('adminCtrl',['$scope','$user','$h','$timeout',function($scope,$user,$h, $timeout){

  if($user.isAdmin() == false)
  {
    $scope.goto('/root');
  }

  $scope.current = {};
  var keys = [];

  $scope.messages = [];
  $scope.cur = '';

  $scope.textArea = false;

  $scope.$watch($scope.textArea,function(val){
    $timeout(function(){
      var str;
      if(val) str = 'adminTA';
      else str = 'adminTF';
      document.getElementById(str).focus();
    })
  });


  $scope.taObj = "";
  $scope.taValid = true;
  $scope.taMsg = '';


  //*****************************************//
  //                  MESSAGE LOGGING
  //*****************************************//


  function add(){


    var dayStr = getDateString();
    var m = '';

    for (var i=0; i<arguments.length; i++){
      m += arguments[i];
      if(i != arguments.length -1) m+='\n';
    }

    $scope.messages.unshift({timestamp:dayStr,message:m});
  }


  //*****************************************//
  //                  PARSING
  //*****************************************//




  $scope.inpKey = function(inp, event){
    if(event.keyCode == 13){
      if(!$scope.textArea) $scope.parse(inp.trim());
      else{
        if(event.shiftKey){
          $scope.textArea = false;
        }
      }
    }
  };


  $scope.parse = function(inp){
    var temp = $scope.taObj;
    temp.replace(/\s|↵/g,"");;
    inp = inp.replace(/(\$TA)/g,temp);
    var cmd = inp.split(' ')[0];
    var options = inp.split(" ");
    if(options.length != 1) {
      options.splice(0,1);

    }else
    {
      options = undefined;
    }
    switch(cmd) {
      case 'clear': clear(); break;
      case 'reset': reset(); break;
      case 'ta': ta(); break;

      case 'send': send(); break;

      case 'set': set(options); break;
      case 'remove': remove(options); break;


      case 'db': db(options); break;
      case 'action': action(options); break;

      case 'current': current(); break;
      case 'log': log(options); break;
      case 'length': break;

      default: add("Unrecognized Command: " + cmd, "\tRecognized Commands: clear, reset, current, set, send, db, action, ta, remove");

    }

    $scope.cur = '';
  };


  //*****************************************//
  //                  FUNCTIONS
  //*****************************************//


  function ta(){
    $scope.textArea = true;
    $timeout(function(){
      document.getElementById('adminTA').focus();
    })

  }

  function clear(){
    $scope.messages = [];
  }

  function reset(){
    $scope.current = {};
    $scope.keys = [];
    $scope.taObj = "";
    $scope.textArea = "";
    $scope.taValid = true;
    $scope.taMsg = '';
  }

  function set(inp){
    if(angular.isUndefined(inp)) return;

    for(var a = 0; a < inp.length; a++){
      var cur = inp[a];
      if(cur.indexOf("=") == -1) add("Invalid Parameter (Missing '=')" + cur);
      else {
        var parts = cur.split("=");
        $scope.current[parts[0]] = parts[1];
        keys.push(parts[0]);
        add("Added Parameter " + parts[0] + " : " + parts[1]);
      }
    }
  }


  function remove(inp) {
    if (angular.isUndefined(inp)) return;

    for (var a = 0; a < inp.length; a++) {
      var cur = inp[a];
      if (angular.isUndefined($scope.current[cur])) add("Invalid Parameter " + cur);
      else {
        delete $scope.current[cur];
        keys.splice(keys.indexOf(cur),1);
        add("Removed Parameter " + cur);

      }

    }

  }
  function send(){


    if(angular.isUndefined($scope.current.action) || angular.isUndefined($scope.current.db)){
      if(angular.isUndefined($scope.current.action)) add("Action Undefined, Required to send");
      if(angular.isUndefined($scope.current.db)) add("Database Undefined, Required to send");
      add("Cancelling...");
    }else{
      add("Sending...");
      current();

    }

  }

  function db(inp){
    add("Setting DB to " + inp);
    $scope.current.db = inp;

  }

  function action(inp){

    if(angular.isUndefined(inp)){
      add("Missing Paramter for Action Call", "\tAllowed Paramters are new, edit, remove");
    }

    add("Setting Action to " + inp[0]);
    $scope.current.action = inp[0];
  }

  $scope.send = function(){

  };

  function log(inp){
    add(inp.join(" "));
  }

  function length(inp){

  }

  function current(){
    var params = '\tParams:\n\t\t';

    for(var a = 0; a < keys.length; a++){
      params += keys[a] + ": " + $scope.current[keys[a]];
      if(a != keys.length -1) params += '\n\t\t';
    }

    add("Current:", "\tDatabase: " + $scope.current.db, "\tAction: " + $scope.current.action, params);
  }



//*****************************************//
//                  UTILS
//*****************************************//


  function getDateString(){
    var date = new Date();
    var seperator = " / ";
    var half = "AM";
    var h = date.getHours();

    if(h > 12){
      half = " PM ";
      h %= 12;
    }

    var ret = "[ ";

    ret += h;
    ret += ":";
    ret += date.getMinutes();
    ret += half;
    ret += " - ";
    ret += date.getDate();
    ret += seperator;
    ret += date.getMonth() + 1;
    ret += seperator;
    ret += date.getFullYear();

    ret += " ]";
    return ret;
  }

  $scope.validateJSON = function(inp,event){

    if(event.keyCode == 16) return;

    var TOKENS = {};

    TOKENS.OBJECT = "OBJECT";

    TOKENS.VALUE = "VALUE";
    TOKENS.KEY = "KEY";

    TOKENS.NUMBER = "NUMBER";
    TOKENS.STRING = "STRING";
    TOKENS.EMPTYSTRING = "EMPTYSTRING";
    TOKENS.BOOL = "BOOLEAN";
    TOKENS.NULL = "NULL";

    TOKENS.LEFTBRACKET = "LEFTBRACKET";
    TOKENS.RIGHTBRACKET = "RIGHTBRACKET";
    TOKENS.COMMA = "COMMA";
    TOKENS.QUOTE = 'QUOTE';
    TOKENS.WORDS = "WORDS";
    TOKENS.COLON = "COLON";
    TOKENS.ERROR = "ERROR";

    TOKENS.LEFTSQUARE = "LEFTSQUARE";
    TOKENS.RIGHTSQUARE = "RIGHTSQUARE";
    TOKENS.ARRAY = "ARRAY";



    $scope.taValid = true;

    var temp = inp.replace(/\s|↵/g,"");

    var curToken;

    if(temp == ''){
      return;
    }

    function e(exp){
      $scope.taValid = false;
      if(angular.isUndefined(curToken)) curToken = "EOF";
      $scope.taMsg = "Expected:  " + exp + ', got ' + curToken;
    }





    var tokenStack = [];

    var inString = false;







    function tokenize(str){

      for(var a = 0; a < str.length; a++){
      var cur = str[a];

        if(inString){

          if(cur == '"'){
            tokenStack.push(TOKENS.QUOTE);
            inString = false;
          }
          else if(tokenStack[tokenStack.length -1] != TOKENS.WORDS) tokenStack.push(TOKENS.WORDS);


        }else {
          if (cur == "{") tokenStack.push(TOKENS.LEFTBRACKET);
          else if (cur == "}") tokenStack.push(TOKENS.RIGHTBRACKET);
          else if (cur == '"'){
            tokenStack.push(TOKENS.QUOTE);
            inString = true;
          }
          else if (cur == ":") tokenStack.push(TOKENS.COLON);
          else if (cur == ",") tokenStack.push(TOKENS.COMMA);
          else if(cur == "n"){
            var temp = str.substring(a,4);
            if(temp == "null") tokenStack.push(TOKENS.NULL);
            else tokenStack.push(TOKENS.ERROR);
            a+=3;
          }else if(cur == "t"){
            var temp = str.substring(a,4);
            if(temp == "true") tokenStack.push(TOKENS.BOOL);
            else tokenStack.push(TOKENS.ERROR);
            a+=3;
          }else if(cur == "f"){
            var temp = str.substring(a,5);
            if(temp == "false") tokenStack.push(TOKENS.BOOL);
            else tokenStack.push(TOKENS.ERROR);
            a+=4;
          }else if(!isNaN(cur) || cur=="-"){
            var periodUsed = false;
            var eUsed = false;
            while(!eUsed && a < str.length && (!isNaN(str[a]) || (str[a] == "." && !periodUsed) || ((str[a] == "e" || str[a] == "E")))){


              if(str[a] == "."){
                a++;
                if(isNaN(str[a])){
                  tokenStack.push(TOKENS.ERROR);
                }
                periodUsed = true;
              }
              else if(str[a] == "e" || str[a] == "E"){
                eUsed = true;
                a++;
                if(isNaN(str[a])){
                  tokenStack.push(TOKENS.ERROR);
                }
              }

              a++;
            }
            a--;
            tokenStack.push(TOKENS.NUMBER);
          }else if(cur == "["){
            tokenStack.push(TOKENS.LEFTSQUARE);
          }else if(cur == "]"){
            tokenStack.push(TOKENS.RIGHTSQUARE);
          }else  tokenStack.push(TOKENS.ERROR);
        }
      }
    }


    function next(){
      curToken = tokenStack[0];
      tokenStack.shift();
      return curToken;
    }


    function eq(tok) {
      return tok == curToken;
    }



    //*****************************************//
    //                  VALIDATING JSON
    //*****************************************//
    tokenize(temp);





      var temp = [];

      while (tokenStack.length != 0) {

        next();

        if (eq(TOKENS.QUOTE)) {
          next();

          if (eq(TOKENS.QUOTE)) {
            temp.push(TOKENS.EMPTYSTRING);
          }
          else if (eq(TOKENS.WORDS)) {
            next();

            if (eq(TOKENS.QUOTE)) {
              temp.push(TOKENS.STRING);
            } else {
              e(TOKENS.QUOTE);
              return;
            }
          } else {
            e(TOKENS.QUOTE + " || " + TOKENS.WORDS);
          }

        }
        else {
          temp.push(curToken);
        }


      }

    tokenStack = temp;





    function look(){
      return tokenStack[0];
    }

    function object(){
      if(next() != TOKENS.LEFTBRACKET){
        e(TOKENS.LEFTBRACKET);
        return false;
      }

      if(look() == TOKENS.RIGHTBRACKET){
        next();
        return true;
      }

      if(!keyValue()) return false;


      if(next() != TOKENS.RIGHTBRACKET){
        e(TOKENS.RIGHTBRACKET);
        return false;
      }

      return true;
    }

    function keyValue(){

      if(next() != TOKENS.STRING){
        e(TOKENS.STRING);
        return false;
      }

      if(next() != TOKENS.COLON){
        e(TOKENS.COLON);
        return false;
      }

      if(!value()) return false;

      if(look() == TOKENS.COMMA){
        next();
        return keyValue();
      }

      return true;
    }

    function array(){
      if(next() != TOKENS.LEFTSQUARE){
        e(TOKENS.LEFTSQUARE);
        return false;
      }
      if(look() == TOKENS.RIGHTSQUARE){
        next(); return true;
      }

      if(!value()) return false;

      while(look() == TOKENS.COMMA){
        next();
        if(!value()) return false;
      }

      if(next() == TOKENS.RIGHTSQUARE) return true;


    }

    function value(){
      if(look() == TOKENS.LEFTBRACKET) return object();
      else if(look() == TOKENS.LEFTSQUARE) return array();
      else {
        var tok = next();
        if(tok == TOKENS.NUMBER || tok == TOKENS.STRING || tok == TOKENS.EMPTYSTRING || tok ==TOKENS.NULL || tok ==TOKENS.BOOL){
          return true;
        }else{
          e("Value expected : TOKENS.NUMBER || TOKENS.STRING || TOKENS.EMPTYSTRING || TOKENS.NULL || TOKENS.BOOL");
        }
      }
    }



    $scope.taValid =  object();




    }






}]);
