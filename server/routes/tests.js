var express = require('express');
var router = express.Router();
var util = require('../utils/utils.js');

var nano = require('nano')('http://localhost:5984');
var sha512 = require('js-sha512');

nano.db.create('tests');
var Test = nano.db.use('tests');





router.post('/get',function(req,res,next) {
    var user = res.kal.user;
    var ret = [];
    e = false;
    for (var a = 0; a < user.tests.length; a++) {


               Test.get(user.tests[a], function (err, body) {
                   if(!e) {
                       if (err) {
                           util.err("Unable to Fetch Tests", 500);
                           e = true;
                       } else {
                           if (body.owner != user["_id"]) {

                               console.log(body.owner + " == " + user["_id"]);
                               util.err("Invalid Test Owner", 403);
                               e = true;

                           } else {
                               ret.push({date: body.date, results: body.results, prefs:body.prefs});
                               if (ret.length == user.tests.length) {
                                   res.send(ret);
                                   res.end();
                               }
                           }
                       }
                   }
               });

    }


});









module.exports = router;