var test = require("kale2e").steps;


test.init(function(){
    words = "Hello World";
    digits = 1234;
    digitWords = "Hello123";
});


var digits;
var words;
var digitWords;


test.when(/set 3 params digits (\d*) letters (\w*) both ([\d\w]*)/, function(l,w,dw){
    digits = d;
    words = w;
    digitWords = dw;
});

test.then(/log params/,function(){
    logDigits();
});

test.then(/Fail/,function(){
    throw new Error("1 != 2");
});

test.when(/Doesnt Fail/,function(){
    console.log("Not failing");
});


function logDigits(){
    console.log("Digits:" + digits);
    console.log("Words: " + words);
    console.log("Digits + Words: " + digitWords);
}

module.exports = test;
