var log = {};

var ansi = require('ansi');
var cursor = ansi(process.stdout);

//*****************************************//
//                  LOGGING
//*****************************************//


log.lvl = {};
log.lvl.init = "INIT";
log.lvl.debug = "DEBUG";
log.lvl.info = "INFO";
log.lvl.warning = "WARNING";
log.lvl.error = "ERROR";
log.lvl.none = "NONE";
log.lvl.failedTest = "TITLE_FAILED";
log.lvl.passedTest = "TITLE_PASSED";
log.lvl.lineFailed = "LINE_FAILED";
log.lvl.linePassed = "LINE_PASSED";


log.PREFERENCES = {};

log.init = function() {



    log.PREFERENCES.COLOR = true;
    log.PREFERENCES.TIME = true;

    log.PREFERENCES.DEBUG = false;
    log.PREFERENCES.INFO = true;
    log.PREFERENCES.WARNING = true;
    log.PREFERENCES.ERROR = true;
    log.PREFERENCES.NONE = false;
    log.PREFERENCES["TITLE_FAILED"] = true;
    log.PREFERENCES["TITLE_PASSED"] = true;
    log.PREFERENCES["LINE_FAILED"] = true;
    log.PREFERENCES["LINE_PASSED"] = true;



};

log.init();




log.setLogLevel = function(val){

    val = val.toUpperCase();


    log.PREFERENCES.DEBUG = false;
    log.PREFERENCES.INFO = false;
    log.PREFERENCES.WARNING = false;
    log.PREFERENCES.ERROR = false;
    log.PREFERENCES.NONE = false;


    switch(val){
        case "NONE": log.PREFERENCES.NONE = true; break;
        case "DEBUG": log.PREFERENCES.DEBUG = true;
        case "INFO": log.PREFERENCES.INFO = true;
        case "WARNING": log.PREFERENCES.WARNING = true;
        case "ERROR": log.PREFERENCES.ERROR = true; break;
        default:
            log.PREFERENCES.WARNING = true;
            log.warn("Invalid Logging Preference " + val);
            log.warn("Reverting to default (INFO)");
            log.init();
            return;
    }

    log.info("Set Logging Preferences: " + val);
};









function getDateString(){
    var date = new Date();
    var seperator = "/";
    var half = "AM";
    var h = date.getHours();

    if(h > 12){
        half = " PM";
        h %= 12;
    }

    var ret = "[";

    ret += h;
    ret += ":";
    ret += date.getMinutes();
    ret += half;
    ret += " - ";    ret += date.getMonth() + 1;

    ret += seperator;
    ret += date.getDate();
    ret += seperator;
    ret += date.getFullYear();

    ret += "]\t";
    return ret;
}

log.title = function(msg){
    cursor.bold();
    log.out(msg.toUpperCase());
};



log.out = function(msg, type){



    //LOGGING OFF
    if(log.PREFERENCES.NONE &&  type != log.lvl.lineFailed && type != log.lvl.linePassed && type != log.lvl.failedTest && type != log.lvl.passedTest ) return;

    //SYSTEM CALL NO TYPE
    if(type) type = type.toUpperCase();
    else type = "INIT";

    if(type != "INIT" && log.PREFERENCES[type] != true) return;




    //COLORIZE
   if(log.PREFERENCES.COLOR)
   {
        if(type == log.lvl.error) cursor.hex("ff0000");
        else if(type == log.lvl.debug) cursor.hex("dc00ff");
        else if(type == log.lvl.info) cursor.hex("21ffc3");
        else if(type == log.lvl.warning) cursor.hex("ff921e");
        else if (type == log.lvl.init) cursor.hex("0099ff");
        else if(type == log.lvl.lineFailed || type == log.lvl.failedTest) cursor.hex("ff0000");
       else if(type == log.lvl.linePassed || type == log.lvl.passedTest) cursor.hex("00d827");
   }


    //TIME
    if(log.PREFERENCES.TIME){

        msg = getDateString() + msg;

    }




    console.log(msg);


    cursor.reset();
};



log.newline = function(){
    console.log("");
};

log.hashline = function(i){

    if(log.PREFERENCES.NONE) return;

    if(!i) i = 80;
    var msg = '';
    for(var a = 0; a < i; a++) msg+= '-';
    console.log(msg);
};


function concatLines(args){
    var msg = '';
    for(var a = 0; a < args.length; a++){
        msg += args[a];
        if(a != args.length -1) msg += '\n\t';
    }

    return msg


}

log.debug = function(){
    msg = concatLines(arguments);
    log.out(msg, log.lvl.debug);
};

log.info = function(){
    msg = concatLines(arguments);
    log.out(msg,log.lvl.info);
};

log.error = function(){
    msg = concatLines(arguments);
    log.out(msg,log.lvl.error);
};

log.warn = function(){
    msg = concatLines(arguments);
    log.out(msg,log.lvl.warning);
};


log.storyTitle = function(title, passed){
    var lvl = log.lvl.passedTest;
    if(!passed) lvl = log.lvl.failedTest;
    cursor.bold();
    title = title.split("/");
    title = title[title.length -1].toUpperCase();
    log.out(title,lvl);

};

log.storyLine = function(line,passed){
    var lvl = log.lvl.linePassed;
    if(!passed) lvl = log.lvl.lineFailed;
    log.out(line,lvl);
};




module.exports = log;

