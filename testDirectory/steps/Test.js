var test = require("kale2e").steps;

var expected = "Hello World";
var current;
var serverLoc = test.prefVars.serverLoc;

var uname;
var pw;


//*****************************************//
//                  INITS
//*****************************************//

test.init(function(){

    current = "Not Hello World";
   // console.log("Calling Init Function");

});


//*****************************************//
//                  WHENS
//*****************************************//

test.when(/I log in as User (.*?) with password (.*?)/,function(user,password){

    uanme = user;
    pw = password;
});

test.when("I hit the server",function(){
    fakeLogin(serverLoc,uname,pw);
});


//*****************************************//
//                  THENS
//*****************************************//

test.then(/Then I expect (.*?) to ([not]) equal (.*?)/,function(varLoc,isNot,expectedLocation){

    if(isNot) test.assertNotEquals(this[varLoc],this[expectedLocation]);
    else test.assertEquals(this[varLoc],this[expectedLocation]);

});


//*****************************************//
//                  Utils
//*****************************************//

function fakeLogin(loc,uname,pw){
    //hit server with rest call, set current to response,
    current = "Hello World";
}





module.exports = test;
