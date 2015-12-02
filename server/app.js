var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var util = require("./utils/utils.js");
var nano = require('nano')('http://localhost:5984');
var sha512 = require('js-sha512');

nano.db.create('users');
var User = nano.db.use('users');


var app = express();

// view engine setup

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use(function(req,res,next){

    res.set({
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Headers': 'origin, content-type, accept, KalToken, KalUsername',
      'Access-Control-Allow-Methods':'GET POST OPTIONS',
      'Access-Control-Request-Headers':'*',
      'Access-Control-Max-Age':'172800'
    });
  if(req.method == 'OPTIONS') res.send();
  else  next();

});

//*****************************************//
//                  INIT
//*****************************************//

app.use(function(req,res,next){
    util.gsReq(req);
    util.gsRes(res);
    res.kal = {};
    next();
});


var hw = require('./routes/helloworld');
app.use('/helloworld',hw);


var up = require('./routes/upload');
app.use('/upload',up);




function verifyUser(req,res,next) {
    var uname = req.headers.kalusername.toLowerCase();
    var token = req.headers.kaltoken;


    util.log("User","GET",uname);
    User.get(uname,function(err,body){
        if(err){
            console.log(err);
            util.err("Invalid Credentials", 403);
            res.end();

        }else{
            if(body.token == token){
                res.kal.user = body;
                next();
            }else{
                console.log(body.token + ' != ' + token);

                util.err("Invalid Credentials", 403);
                res.end();


            }
        }
    })
}

app.use(function(req,res,next){




    if(/\/user\/.*/.test(req.path) || req.path == '/helloworld' || req.path=='/upload'){
        next();
    }else
    {
        if(util.checkParams(req.headers, ['kalusername', 'kaltoken'], true)) verifyUser(req,res,next);
    }
});



var users = require('./routes/users');
app.use('/user', users);

var tests = require('./routes/tests');
app.use('/tests', tests);






// error handlers

// development error handler
// will print stacktrace
/*
app.use(function(err,req, res, next) {
    if(err){
        console.log("ERROR - " + err);

    }
     util.err("Not Found",404);

});

*/






module.exports = app;




