var express = require('express');
var router = express.Router();

var nano = require('nano')('http://localhost:5984');
var sha512 = require('js-sha512');

nano.db.create('tests');
var User = nano.db.use('users');
var Test = nano.db.use('tests');


var util = require('../utils/utils.js');


router.post('',function(req,res,next){

    if(util.checkParams(req.body,['username','password','results','prefs'])) next();
});

router.post('',function(req,res,next){

    var params = req.body;

    var username = params.username.toLowerCase();
    var password = params.password;

    util.log('USER','GET',username);
    User.get(username,function(err,UserRet){

        if(util.def(err)) {
            util.err('Invalid Credentials', 403);
            return;
        }

        if(UserRet.password !== sha512(password + username)){
            util.err('Invalid Credentials', 403);
            return;
        }


            var dbObj = {};
            dbObj.owner = username;
            dbObj.results = JSON.parse(params.results);
            dbObj.date = new Date();
            dbObj.prefs = JSON.parse(params.prefs);

            //SAVE
            Test.insert(dbObj,function(err, testRet){

                if(util.def(err)){
                    console.log(err);
                    util.err("Error writing to the DB",500);
                }
                else {

                    console.log(JSON.stringify(testRet));
                    if(!UserRet.tests) UserRet.tests = [];

                    UserRet.tests.push(testRet['id']);

                    User.insert(UserRet, function (err, body) {
                        if (!util.def(err)) {
                            res.send("Upload Complete");
                            res.end();
                        }
                        else {
                            console.log(err);
                            util.err('Server Blew Up', 500);
                        }
                    });
                }
            });




    });



});



module.exports = router;
