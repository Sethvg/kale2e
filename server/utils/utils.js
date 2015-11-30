var nano = require('nano')('http://localhost:5984');
nano.db.create('users');
var User = nano.db.use('users');

var colors = require('colors');


var utils = {};
var Req;

utils.gsReq = function(val)
{
    if(utils.def(val)) Req = val;
    else return Req;
};

var Res;

utils.gsRes = function(val)
{

    if(utils.def(val)) Res = val;
    else return Res;
}





utils.checkParams = function(body,arr,isAuth){
    var missing = [];
    for(var a = 0; a < arr.length; a++){
        if(typeof body[arr[a]] == 'undefined'){
           missing.push(arr[a]);
        }
    }

    if(missing.length != 0) {
        Res.status(400);
        if(!isAuth) Res.send({'Missing': missing});
        else Res.send({'Missing Auth Headers': missing});
        Res.end();
        return false;
    }
    return true;
};

utils.err = function(msg, status){
    Res.status(status);
    Res.send({error:msg});
    Res.end();
    return false;

};




utils.def = function(obj){
    return (typeof obj !== 'undefined') && (obj !== null)
};



utils.getUser = function(req,res,next){

    if(utils.checkParams(req.headers,['kalusername','kaltoken'], true)){

        var username = req.headers.kalusername.toLowerCase();
        var token = req.headers.kaltoken;

        utils.log('USER','GET',username);
        User.get(username,function(err,body){
            if(err){
                utils.err('Invalid Credentials',403);
            }else {
                if(body.token == token){
                    res.locals.kalUser = body;
                    next();
                }
                else utils.err('Invalid Credentials',403);
            }
        });
    };
};


utils.log = function(db,action,val){
    console.log(
       utils.colors.ANSI_PURPLE  + '\tCouchDB - ' + db.toUpperCase() + ' (' + action.toUpperCase() +') -- '  + val
    );
};

utils.colors = {};
utils.colors.ANSI_RESET = "\u001B[0m";
utils.colors.ANSI_BLACK = "\u001B[30m";
utils.colors.ANSI_RED = "\u001B[31m";
utils.colors.ANSI_GREEN = "\u001B[32m";
utils.colors.ANSI_YELLOW = "\u001B[33m";
utils.colors.ANSI_BLUE = "\u001B[34m";
utils.colors.ANSI_PURPLE = "\u001B[35m";
utils.colors.ANSI_CYAN = "\u001B[36m";
utils.colors.ANSI_WHITE = "\u001B[37m";





    module.exports = utils;