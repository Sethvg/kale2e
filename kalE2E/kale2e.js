var kal = {};

var fs = require('fs');
var log = require('./utils/logger.js');
var path = require('path');
var runner = require("./utils/executor.js");
var emitter = runner.getEmitter();
var read = require('read');

var query = require('querystring');
var http = require('http');



var host='kalieki.ddns.net';
var port='3000';
var ext = '/upload';



//*****************************************//
//                  LOCATIONS
//*****************************************//

var prefLoc = 'preferences/pref.json';
var storiesFolder = 'stories';
var stepsFolder = 'steps';
var variables = [];
var env;
var tagsToFilter = false;
var authorToFiler = false;
var dateMinToFilter = false;
var dateMaxToFilter = false;


//*****************************************//
//                  PRE RUN CONFIG
//*****************************************//



kal.setStoriesFolder = function(loc){
    log.warn('(PRE) Stories folder set to: ' + loc);
    storiesFolder = loc;
};

kal.setStepsFolder = function(loc){
    log.warn('(PRE) Steps folder set to: ' + loc);

    stepsFolder = loc;
};

kal.setPrefLocation = function(loc){
    log.warn('(PRE) Preferences location set to: ' + loc);
    prefLoc = loc;
};

kal.setEnv = function(environment){
    log.warn('(PRE) Environment set to: ' + environment);

    env = environment;
};


//*****************************************//
//                  RUN
//*****************************************//




kal.run = function(){

    log.hashline();
    log.hashline();
    log.title("WELCOME TO KALIEKI END TO END TESTING!");
    log.out("Written by Seth Van Grinsven - Savggamer@gmail.com");
    log.hashline();
    log.hashline();

    if(!env && process.env.ENV) env = process.env.ENV;

    if(!env){
        log.warn("No environment variable has been set");
    }


    getPreferences(prefLoc);
    compileSteps();
    compileStories();


};




//*****************************************//
//                  PREFERENCES
//*****************************************//




function getPreferences(location){

    log.title("Reading in the Preferences Files");
    log.out("Location: " + prefLoc);
    log.out("Environment: " + env);


    var prefs;

    try {
        prefs = JSON.parse(fs.readFileSync(location, 'utf8'));
        if(env && prefs[env]) prefs = prefs[env];
        else prefs = {};
    }catch(e){
        log.error(e);

        if(e.code == 'ENOENT') kal.exit(1);
        else if(e instanceof SyntaxError) kal.exit(1);
        else kal.exit(1);
    }


    testInit.prefVars = prefs.vars;

    if(prefs.log){
        if(prefs.log.level) log.setLogLevel(prefs.log.level);
        if(prefs.log.color == false){
            log.PREFERENCES.COLOR = false;
        }
        if(prefs.log.timestamp == false) log.PREFERENCES.TIME = false;
    }

    log.debug("Logging Preferences: ",JSON.stringify(log.PREFERENCES,undefined,2).replace(/[\n]/g,'\n\t'));


    if(prefs.files){
        var fil = prefs.files;
        if(fil.stories){
            log.info("Setting Stories File to " + fil.stories);
            storiesFolder = fil.stories;
        }
        if(fil.steps){
            stepsFolder = fil.steps;
            log.info("Setting Steps File Location to " + fil.steps);
        }
    }

    if(prefs.stories){
        var stories = prefs.stories;



        if(stories.tags){
            if(stories.tags instanceof Array){
                tagsToFilter = stories.tags;
            }else{
                tagsToFilter = [];
                tagsToFilter.push(stories.tags);
            }
        }
        if(stories.author){
            if(stories.author instanceof Array){
                authorToFiler = stories.author;
            }else{
                authorToFiler = [];
                authorToFiler.push(stories.author);
            }
        }

        if(stories.dateMax){
            dateMaxToFilter = new Date(stories.dateMax);
        }

        if(stories.dateMin){
            dateMinToFilter = new Date(stories.dateMin);
        }
    }

    log.debug("File Preferences: ", "Stories: " + storiesFolder, "Steps: " + stepsFolder);
    log.debug("Story Preferences:","Tags: " + tagsToFilter, "Author: " + authorToFiler, "DateMin: " + dateMinToFilter, "DateMax: " + dateMaxToFilter);
    log.hashline();


};



//*****************************************//
//                  Compilation
//*****************************************//


var globalWhens = [];
var globalThens = [];
var globalInits = [];

function compileSteps(){

    log.debug("Compiling Steps Begin");

    var files = getAllFiles(stepsFolder,".js");

    log.debug("Steps Files Found:");
    log.debug(files);



    for(var a = 0; a < files.length; a++){
        var temp;
        var good = true;
        log.debug("Parsing file " + files[a]);
        try {
            temp = require(process.cwd()+"/"+files[a]);

            if(!temp.KALIEKIIDENTIFIER){
                good = false;
            }
        }catch(err){
            good = false;
            log.warn(err);
        }

        if(!good){
            good = false;
            log.warn("Invalid File Structure: " + files[a]);
            log.warn("Files should be of the form:");
            log.hashline(10);
            log.warn("var test = require('kale2e').steps");
            log.warn();
            log.warn("//Code//");
            log.warn("test.init(function(){....});");
            log.warn("test.when('I log in',function(){....});");
            log.warn("test.then('String Match',function(){....});");
            log.warn();
            log.warn("module.export = test");
            log.hashline(10);
            kal.exit(1)
        }else if(good){

            log.info(files[a] + " parsed correctly.");
        }
    }

    log.debug("Inits: " + JSON.stringify(globalInits,null,4));
    log.debug("Whens: " + JSON.stringify(globalWhens,null,4));
    log.debug("Thens: " + JSON.stringify(globalThens,null,4));




    log.debug("Compiling Steps End");
}


var globalStories = [];

function compileStories(){

    log.debug("Compiling Stories Start");
    var files = getAllFiles(storiesFolder,".kalst");

    parseFiles(files);

}



//*****************************************//
//                  Parsing
//*****************************************//

function parseFiles(pathArray){
    var clean = true;
    var errs = [];


    var calls = 0;
    function done(){
        calls++;
        if(calls == pathArray.length){
            var quit = false;
            for(var a = 0; a < errs.length; a++){
                var err = errs[a];
                if(err.quit){
                    log.error(err.msg + "(Critical)");
                    quit = true;
                }else{
                    log.warn( err.msg);
                }
            }

            if(quit) exit(1);
            log.debug("Compiling Stories End");
            parseCompiledStories();
        }
    }






    for(var a = 0; a < pathArray.length; a++){
        var file = pathArray[a];
        readFile(file);
    }

    function readFile(file){


        function newErr(msg,quit){
            var temp = {};
            temp.msg = "File " + file + " : " + msg;
            temp.quit = false;
            if(quit) temp.quit = quit;
            errs.push(temp);
        }


        fs.readFile(pathArray[a],'utf8',function(err,body){
            if(err){
                log.error(err);
                exit(1);
            }



            var story = {};
            story.priority = 0;
            story.tags = [];
            story.date = new Date();
            story.authors = [];
            story.file = file;
            story.tests = [];
            story.preVerbalize = [];

            function newText(str){
                if(str == '' ) return;
                else if(str[0] == '#') return;

                var temp = {};

                if(str[0] == '>' && story.tests.length == 0){
                 story.preVerbalize.push(str.substr(1,str.length));
                    return;
                }
                else if(str[0] == '>'){
                    temp.type = "LOG";
                    temp.content = str.substr(1,str.length);
                }else{
                    temp.type="RUN";
                    temp.content = str.trim();
                }
                if(story.tests.length ==0){
                    newErr("You cannot add lines without initilizing a test in the form of: Test:Description");
                }
                story.tests[story.tests.length-1].content.push(temp);
            }

            var lines = body.split('\n');

            for(var a = 0; a < lines.length; a++){
                var line = lines[a];
                line = line.trim();


                if(/Tag\:.*/.test(line)){
                    var parts = line.split(":");

                    if(parts.length != 2){
                        newErr("Tag should be in the form 'Tag:t1,t2,...tn");
                    }

                    var tags = parts[1].split(",");
                    tags.forEach(function(tag){
                        story.tags.push(tag.trim());
                    });
                }


                else if(/Priority\:.*/.test(line)){
                    var parts = line.split(":");
                    if(isNaN(parts[1])){
                        newErr("Priority Needs to be a number, Defaulting to 0");
                    }else{
                        story.priority = parts[1];
                    }

                    if(parts.length != 2){
                        newErr("Priority should be in the form 'Priority:i'");
                    }

                }


                else if(/Author\:.*/.test(line)){
                    var parts = line.split(":");
                    if(parts.length != 2){
                        newErr("Priority should be in the form 'Author:a1,a2,...aN'");
                    }

                    var authors = parts[1];
                    parts = authors.split(",");
                    parts.forEach(function(a){
                        story.authors.push(a);
                    });
                }

                else if(/Date\:.*/.test(line)){

                    var parts = line.split(":");
                    if(parts.length != 2){
                        newErr("Date should be in the form 'Date:yyyy-mm-dd'");
                    }

                    var date = parts[1];
                    story.date = new Date(date);
                }

                else if(/Test\:.*/.test(line)){
                    var parts = line.split(":",2);

                    story.tests.push({title:parts[1].trim(),content:[]});
                }

                else{
                    newText(line);
                }



            }



            log.debug("Read in story:\n" + JSON.stringify(story,null,4));
            if(story.tests.length == 0){
                newErr("Filtered out because of 0 tests");
            }
            globalStories.push(story);




            done();
        });
    }


}







function parseCompiledStories(){
    filterByTag();
    filterByAuthor();
    filterByDate();
    sortByPriority();

    executeStories();
}

//*****************************************//
//                  Execute
//*****************************************//

function executeStories(){
    runner.setSteps(globalInits,globalWhens,globalThens);
    runner.setStories(globalStories);
    var results = runner.execute();
}

//*****************************************//
//                  FILTERS
//*****************************************//

function filterByTag(){
    if(!tagsToFilter || tagsToFilter.length == 0) return;

    for(var a = 0; a < globalStories.length; a++){
        var curStory = globalStories[a];
        var found = false;
        curStory.tags.forEach(function(tag){
           if(tagsToFilter.indexOf(tag) != -1){
               found = true;
           }
        });

        if(!found){
            globalStories.splice(a,1);
            log.debug("Filtered out (Based on Tag):" + curStory.file);
            a--;
        }
    }
}


function filterByAuthor(){
    if(!authorToFiler || authorToFiler.length == 0) return;

    for(var a =0; a < globalStories.length; a++){
        var curStory = globalStories[a];
        var found = false;

        curStory.authors.forEach(function(auth){
            if(authorToFiler.indexOf(auth) != -1){
                found = true;
            }
        });

        if(!found){
            globalStories.splice(a,1);
            log.debug("Filtered out (Based on Author):" + curStory.file);
            a--;
        }
    }
}


function filterByDate(){
    if(!dateMinToFilter && !dateMaxToFilter) return;

    for(var a =0; a < globalStories.length; a++){
        var curStory = globalStories[a];


        if(dateMinToFilter && (curStory.date >= dateMinToFilter) == false){
                globalStories.splice(a,1);
                log.debug("Filtered out (Based on Min Date):" + curStory.file);
                a--;
        }
        else if(dateMaxToFilter && (curStory.date <= dateMaxToFilter) == false){
            globalStories.splice(a,1);
            log.debug("Filtered out (Based on Max Date):" + curStory.file);
            a--;
        }

    }
}

function sortByPriority(){
    log.debug("Begin Priority Sort");
    globalStories.sort(function(A,B){
        return  B.priority - A.priority;
    });
    log.debug("End Priority Sort");

}




//*****************************************//
//                  REPORT
//*****************************************//



upload = -1;
local = -1;
uploadUsername = '';
uploadPassword = '';

function parseInputs(chunk){
    if(upload == -1){
        if(/[Yy]([eE][sS]){0,1}/.test(chunk)){
            upload = true;
            presentChoice();
        }else if(/[Nn][oO]{0,1}/.test(chunk)){
            upload = false;
            presentChoice();
        }else{
            process.stdout.write("Unrecognized Command: " + chunk);
            presentChoice();
        }
    }else if(upload == false && local == -1){
        if(/[Yy]([eE][sS]){0,1}/.test(chunk)){
            local = true;
            printLocal();
        }else if(/[Nn][oO]{0,1}/.test(chunk)){
            local = false;
            process.exit(0);
        }else{
            process.stdout.write("Unrecognized Command: " + chunk);
            presentChoice();
        }
    }else if(uploadUsername == ''){
        uploadUsername = chunk.trim();
        presentChoice();
    }
}

function presentChoice(){
    if(upload == -1) process.stdout.write('Would you like to upload this to KalE2E? (Y/N) > ');
    else if(upload == false && local == -1) process.stdout.write('Would you like to print the results to console? (Y/N) > ');
    else if(uploadUsername == '') process.stdout.write('What is your Username > ');
    else if(uploadPassword == ''){
        process.stdin.pause();
        process.stdout.write('What is your Password > ');
        read({ prompt: 'Password: ', silent: true }, function(er, password) {
            uploadPassword = password;
            process.stdin.pause();
            up();
        })
    }


}

var testResults;
function done(data){
    testResults = data;
    process.stdin.setEncoding('utf8');

    process.stdin.on('readable', function() {
        var chunk = process.stdin.read();
        if(chunk) parseInputs(chunk);
    });


    presentChoice();



}
emitter.on('done',done);







function up(){


    console.log("Uploading....");
    var pref = {};
    pref.env = env;
    pref.vars = testInit.prefVars;

    pref.tags = tagsToFilter;
    pref.author = authorToFiler;
    pref.dateStart = dateMinToFilter;
    pref.dateEnd = dateMaxToFilter;
    var body = query.stringify({username:uploadUsername,password:uploadPassword,prefs:JSON.stringify(pref), results:JSON.stringify(testResults)});



    var post_options = {
        host: host,
        port: port,
        path: ext,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(body)
        }
    };


    var abort = false;

    var post_req = http.request(post_options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            if(!abort) {
                handle(chunk, res);
            }


        });
    });

    post_req.write(body);
    post_req.end();
}


function handle(data,res){

    if(res.statusCode == 200 && data == 'Upload Complete'){
        log.info("Upload Complete");
        process.exit();
    }else{
        log.error("Error (" + res.statusCode + ") - " + data);
        log.error("Retrying - ");
        uploadUsername = '';
        upload = -1;
        local = -1;
        uploadPassword = '';
        done(testResults);
    }
}


function printLocal(){
    process.stdin.pause();

}




//*****************************************//
//                  EXIT
//*****************************************//



kal.exit = function(i){
    var type;

    if(i && i != 0)
    {
        type = log.lvl.error;
    }

    log.out('Process is Exiting with status - ' + i,type);
    process.exit(i);
};






//*****************************************//
//                  FileIOUtils
//*****************************************//

function getAllFiles(dir,ext){

    var ret = [];



    function recFileSearch(cur){
        var files = fs.readdirSync(cur);

        for(var a = 0; a < files.length; a++){

            files[a] = cur+"/" + files[a];
            if(fs.lstatSync(files[a]).isDirectory()){
                recFileSearch(files[a]);
            }else if(fs.lstatSync(files[a]).isFile() && path.extname(files[a]) == ext){
                ret.push(files[a]);
            }
        }



    }

    recFileSearch(dir);

    return ret;
}



//*****************************************//
//                  TestInit Object
//*****************************************//

var testInit = {};

testInit.KALIEKIIDENTIFIER = "HelloFriend";
testInit.when = function(regexString, func){
    var i = {};
    if(regexString instanceof RegExp == false){
        regexString = new RegExp(regexString);
    }
    i.reg = regexString;
    i.cb = func;

    log.debug("Parsing When: " + i.toString());

    globalWhens.push(i);
};

testInit.then = function(regexString,func){
    var i = {};
    if(regexString instanceof RegExp == false){
        regexString = new RegExp(regexString);
    }
    i.reg = regexString;
    i.cb = func;

    log.debug("Parsing Then: " + i.toString());

    globalThens.push(i);
};



testInit.init = function(func){
    var obj = {};
    obj.cb = func;
    globalInits.push(obj);
};



testInit.assertEquals = function(a,b){
    if(a !== b){
        throw new Error("Expected " + a + " to equal " + b);
    }
};

testInit.assertTrue = function(a){
	if(a !== true) throw new Error("Expected " + a + " to be true");  
};

testInit.assertFalse = function(a){
	if(a !== false) throw new Error("Expected " + a + " to be false");
};

testInit.fail = function(){
    throw new Error("Failed");
};



testInit.resume = function(){
    runner.resume();
};

testInit.wait = function(len,cb){
    runner.setWait(len,cb);
};


testInit.prefVars = {};


//****************************************//
//        Combine and Export
//****************************************//
kal.steps = testInit;
kal.log = log;
module.exports = kal;
