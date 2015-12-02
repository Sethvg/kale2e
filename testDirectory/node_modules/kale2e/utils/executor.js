var ex = {};
var log = require("./logger.js");
var stories;
var steps = {};
var util = require('util');
var events = require('events').EventEmitter;
var emitter = new events();


ex.getEmitter = function(){
    return emitter;
}



var hold = console.log;


ex.setStories = function(st){
    stories = st;
};

ex.setSteps = function(inits,whens,thens){
    steps.inits = inits;
    steps.whens = whens;
    steps.thens = thens;
};

ex.execute = function(){
    log.hashline();
    log.hashline();
    log.title("Tests Begin");
    log.hashline();
    log.hashline();
    start();
};




//*****************************************//
//                  Inits
//*****************************************//


function runInits(){

    steps.inits.forEach(function(init){
        init.cb();
    });
}


var pTotal = 0;
var pCur = 0;

function initResults(){

    stories.forEach(function(story){
        results.stories.push({
            tests:[],
            log: story.preVerbalize,
            file: story.file
        });


        story.tests.forEach(function(test){
            var i = results.stories.length-1;
            results.stories[i].tests.push({
                pLineIndex: pTotal,
                lines:[],
                title:test.title,
                passed:true

            });
            test.content.forEach(function(con){
                pTotal++;

                var ii = results.stories[i].tests.length-1;
                results.stories[i].tests[ii].lines.push({
                    content:con,
                    passed:true,
                    matched:0,
                    consoleBuffer : [],
                    error:0,
                    params:0
                });
            });
        });
    });
}

//*****************************************//
//                  Stories
//*****************************************//


var results = {
    stories:[],
    failed:0,
    passed:0
};




function start(){
    initResults();
    runLine();
}

var storyIndex = 0;
var testIndex = 0;
var lineIndex = 0;
var finished = false;

function nextLine(){


    console.log = hold;
    var line = results.stories[storyIndex].tests[testIndex].lines[lineIndex]
    for(var a = 0; a < line.consoleBuffer.length; a++){
        console.log = hold;
        console.log(line.consoleBuffer[a]);
    }

    pCur++;
    lineIndex++;


    if(results.stories[storyIndex].tests[testIndex].lines.length <= lineIndex){
        nextTest();
    }



}

function nextTest(){
    lineIndex = 0;
    curKeyword = 0;
    testIndex++;

    if(results.stories[storyIndex].tests.length <= testIndex){
        nextStory();
    }

    else if(results.stories[storyIndex].tests[testIndex].lines.length == 0){
        nextTest();
    }

    if(validIndicies()) pCur = results.stories[storyIndex].tests[testIndex].pLineIndex
}

function nextStory(){
    lineIndex = 0;
    testIndex = 0;
    storyIndex++;

    if(results.stories.length <= storyIndex){
        finished = true;
        return;
    }

    if(results.stories[storyIndex].tests.length == 0){
        nextStory();
    }
    else if(results.stories[storyIndex].tests[testIndex].lines.length == 0){
        nextTest();
    }

}

function validIndicies(){
    return results.stories[storyIndex] && results.stories[storyIndex].tests[testIndex] && results.stories[storyIndex].tests[testIndex].lines[lineIndex];
}


var curKeyword;

function runLine(){

    if(waiting) return;

    if(finished){
        logResults();
        return;
    }

    if(!validIndicies()){
        log.debug("Invalid Indecies Check, should not happen, but safegaurd against out of options");
        nextLine();
        runLine();
        return;
    }

    if(lineIndex == 0){
        runInits();
    }





    log.debug("Running: Stories[" + storyIndex + "].Tests[" + testIndex + "].Lines[" + lineIndex +"]" );



    var line = results.stories[storyIndex].tests[testIndex].lines[lineIndex];


    if(line.content.type == "LOG"){
        nextLine();
        runLine();
        return;
    }



    var str = line.content.content;

    var type = str.split(' ')[0];

    if(type == "When"){
        curKeyword = "When";
    }else if(type == "Then"){
        curKeyworld = "Then";
    }else if(type == "And" && curKeyword != 0){
        type = curKeyword;
    }else{
        failLine(new Error("Runetime Parse Error - Unrecognized Keyword " + type));
        nextTest();
        runLine();
        return;
    }

    var regs;
    if(type == "When"){
        regs = steps.whens;
    }else if(type == "Then"){
        regs = steps.thens;
    }
    var mFound = false;
    var f = false;

    for(var a = 0; a < regs.length; a++){

        if(regs[a].reg.test(str)){
            mFound = true;
            var matches = str.match(regs[a].reg);
            matches.splice(0,1);

            log.info("Running Line " + (1+pCur) + " / " + pTotal + "   " + str + (matches.length != 0 ? ("   <" + matches + ">"):""));
            console.log = function(str){
                line.consoleBuffer.push(str);
            };


            line.params = matches;
            line.matched = regs[a].reg.toString();




            try{

                regs[a].cb.apply(console,matches);
                nextLine();
            }catch(e) {

                failLine(e.stack);
                console.log=hold;
                log.error("Line Failed: " + str);
                log.error(e);
                nextTest();
            }





            break;
        }
    }



    if(mFound == false){
        console.log = hold;
        console.warn("Failed to find regex match for " + str);
        failLine(new Error("No Matching Regex for Line"));
        nextTest();
    }



    if(!waiting){

        runLine();
    }


}


function logResults(){
    emitter.emit('done',results);
}

function failLine(e){
    if(!results.stories[storyIndex].tests[testIndex].lines[lineIndex].passed) return;

    //console.log(e);
    results.failed++;
    results.stories[storyIndex].tests[testIndex].passed = false;
    results.stories[storyIndex].tests[testIndex].lines[lineIndex].passed = false;
    results.stories[storyIndex].tests[testIndex].lines[lineIndex].error = e;
    return;

}


function timeOut(){
    console.debug("Timeout");
    waiting = false;
    toCB();
    failLine(new Error("Timeout after " + waitDuration + " seconds. Make sure you call test.resume() after an async call"));
    setTimeout(function(){
        runLine();
    });

}


var waiting = false;
var waitDuration = 0;
var toCB =

ex.setWait = function(i,cb){
    waiting = true;
    toCB = cb;
    waitDuration = i;
    var r = i;
    setTimeout(w,1000,r);
};

ex.resume = function(){
    waiting = false;
    waitDuration = 0;
};


function w(remaining){
    remaining--;
    if(waiting == false){
        setTimeout(function(){
            runLine();
        },1);

    }
    else if(remaining <= 0) timeOut();
    else{
        setTimeout(w,1000,remaining-1);
    }

}









module.exports = ex;