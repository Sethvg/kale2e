var express = require('express');
var router = express.Router();


var util = require('../utils/utils.js');


var expectedUname = 'Kalieki';
var expectedPw = 'Hunter2';




//*********************************************//
//         post - /new
//**********************************************//
router.use(function(request,response,next){
    console.log(request.body);

    if(util.checkParams(request.body,['username','password']))
    next();
});

router.post('',function(request,response,next){

    params = request.body;

    name = params.username;
    password = params.password;


    if(name == expectedUname && password == expectedPw){
        response.send({msg:"Valid Credentials"});
        response.end();
    }else{
        util.err("Invalid Username Password Combination",403);
    }


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














