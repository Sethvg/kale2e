var express = require('express');
var router = express.Router();
var nano = require('nano')('http://localhost:5984');
var sha512 = require('js-sha512');

nano.db.create('users');
var User = nano.db.use('users');
var util = require('../utils/utils.js');
var crypto = require('crypto');

/*
router.get('/', function(req, res, next) {
  res.send({test:'hello'});
});

nano.db.create('books');
var books = nano.db.use('books');

//Insert a book document in the books database
books.insert({name: 'The Art of war'}, null, function(err, body) {
  if (!err){
    console.log(body);
  }
});

//Get a list of all books
books.list(function(err, body){
  console.log(body);
});

*/

var name;
var password;
var email;
var username;

router.use(function(request,response,next){
    name = '';
    password = '';
    email = '';
    username = '';
    next();
});


//*********************************************//
//         post - /new
//**********************************************//
router.post('/new',function(request,response,next){
   if(util.checkParams(request.body,['name','username','password','email']))
    next();
});
router.post('/new',function(request,response,next){

    params = request.body;

    name = params.name;
    password = params.password;
    email = params.email;
    username = params.username.toLowerCase();

    User.head(username,function(err,_,headers){

        if(!util.def(err)) util.err('Username Already Exists',400);
        else if(err.statusCode == 404) next();
    });


});

router.post('/new',function(request,response,next){

    var dbObj = {};
    dbObj["_id"] = username;
    dbObj.password = sha512(password + username);
    dbObj.email = email;
    dbObj.name = name;
    dbObj.token = crypto.randomBytes(64).toString('hex');
    dbObj.tests = [];




    //SAVE

    User.insert(dbObj,function(err, body){

        if(util.def(err)){
            console.log(err);
            util.err("Error writing to the DB",500);
        }
        else
        {
            ret = {};
            ret.token = dbObj.token;
            ret.username = username;
            response.send(ret);
        }
    });
});



//*********************************************//
//            post - /taken/username
//**********************************************//


router.post('/taken/username',function(request,response,next) {
    if (util.checkParams(request.body, ['username'])) next();
});

router.post('/taken/username',function(request,response,next){
    util.checkParams(request.body,['username']);
    var username = request.body.username.toLowerCase();
    User.head(username,function(err,_,headers){
        var ret = {taken:false};
        if(!util.def(err)) ret.taken = true;

        response.send(ret);
    });

});

//*********************************************//
//            post - /taken/email 
//**********************************************//

//router.post('/taken/email',function(request,response,next){
    
    
    
//});

//*********************************************//
//         post - /login
//**********************************************//
router.post('/login',function(request,response,next){
    if(util.checkParams(request.body, ['username','password'])) next();
});

router.post('/login',function(request,response,next){
    var params = request.body;

    var username = params.username.toLowerCase();
    var password = params.password;

    util.log('USER','GET',username);
    User.get(username,function(err,body){

        if(util.def(err)) {
            util.err('Invalid Credentials', 403);
            return;
        }

        if(body.password !== sha512(password + username)){
            util.err('Invalid Credentials', 403);
            return;
        }

        body.token = crypto.randomBytes(64).toString('hex');

        var ret = {};
        ret.token = body.token;
        ret.username = params.username;



        util.log('USER','INSERT',body._id);
        User.insert(body,function(err, body){
            if(!util.def(err)) response.send(ret);
            else{
                console.log(err);
                util.err('Server Blew Up',500);
            }
        });

    });





});

//**************************************************
//                      VERIFY TOKEN
//*************************************************


router.post('/verify',function(req,res,next){
    if(util.checkParams(req.body, ['username','token'])) next();
});

router.post('/verify',function(req,res,next){
    var uname = req.body.username.toLowerCase();
    var token = req.body.token;


    util.log("User","GET",uname);
    User.get(uname,function(err,body){
        if(err){
            res.send("Bad Credentials");
            res.end();

        }else{
            if(body.token == token){
                res.send("Valid");
                res.end();
            }else{
                res.send("Invalid Credentials");
                res.end();

            }
        }
    })
});


module.exports = router;



/*








 OOO
OOOOO
 OOO
 //
 //
 /////////////////////////////////////////////////////
 // * * * * * * // _________________________________//
 //  * * * * *  // _________________________________//
 // * * * * * * // _________________________________//
 //  * * * * *  // _________________________________//
 // * * * * * * // _________________________________//
 //  * * * * *  // _________________________________//
 // * * * * * * // _________________________________//
 ///////////////// _________________________________//
 //_________________________________________________//
 //_________________________________________________//
 //_________________________________________________//
 //_________________________________________________//
 //                                                 //
 /////////////////////////////////////////////////////
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //
 //





















*/














